if(process.env.NODE_ENV != "poduction"){
  require('dotenv').config()
}
//console.log(process.env.SECRET)

const Listing = require("./models/listing.js");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsmate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const path = require("path");
const app = express();
const port = process.env.PORT;
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//restructure 
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js"); 
const userRouter = require("./routes/users.js"); 

const { register } = require("module");
const { clear } = require('console');

//after restructure donot use again 
    //const { listingSchema,reviewSchema } = require("./schema.js");
    //const Review = require("./models/review.js");
   // const Listing = require("./models/listing.js");
    //const wrapAsync = require("./utils/wrapAsync.js");

//middile ware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));//encode
app.use(methodOverride("_method"));//method change
app.engine("ejs",ejsmate);//same templet all pages
app.use(express.static(path.join(__dirname, "/public")));


//monogdb sever conncetion"
//local data base in local pc 
//const MONGODB_URL = "mongodb://127.0.0.1:27017/airnb";
//hosted data base on atlas
const dburl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("webserver connected to database");
  })
  .catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(dburl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

//app.get("/", (req, res) => {
  //res.send("Welcome to dakudada world");
//});

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.COOKIE_SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("ERROR in MONGO SECTION",error);
})
// cookie
const sessionOperation = {
  store,
  secret:process.env.COOKIE_SECRET,
  resave:false,
  saveUninitialized:true,
  Cookie:{
    expires:Date.now()+7*24*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};
app.use(session(sessionOperation));

// falsh message
app.use(flash());


//athentication middlewar
app.use(passport.initialize());//configure Passport
app.use(passport.session());//persistent login sessions 
//to setup Passport-Local Mongoose
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

//Passport to serialize users into the session
passport.serializeUser(User.serializeUser());
//Passport to deserialize users into the session
passport.deserializeUser(User.deserializeUser());

//flash message
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  
  
  res.locals.currUser = req.user;
 
  next();
});

//demo user
// app.get('/demoUser', async (req, res) => {
//   const fakeUser = new User({
//       email: 'sayak@gmail.com', // Corrected the typo in the email
//       username: 'student',
//   });

//  try {
//      let newUser = await User.register(fakeUser, 'hello');
//      res.send(newUser);
//  } catch (error) {
//      res.status(500).send({ error: error.message });
//  }
//});



// restructure listings

app.use("/listing",listingRouter);
//parent route --/listing
// restructure reviews
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/search", async (req, res) => {
  const { title } = req.query;
  //console.log(req.query);
  const currentPage = parseInt(req.query.page) || 1;
  const itemsPerPage = 6;

  const query = {}; // Create an empty object
  if (title) {
    query.title = { $regex: title, $options: "i" };
    //console.log(query.title);
  }

  // Sorting
  const sortOptions = {};
  const sortBy = "title";
  const sortOrder = "desc";
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Paging
 const skip =(currentPage - 1) * itemsPerPage;

  try {
    // Find listings based on the query, with sorting and pagination
    const users = await Listing.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage);

    // Count total number of items that match the query
    const total = await Listing.countDocuments(query);

    if (users.length > 0) {
      res.render("listing/search.ejs", { users, total });
    } else {
      // Handle case where no users are found
      res.redirect("/no-results-found");
    }

    
  }catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Server error");
  }
});


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
//category === description 
//get paginate data
app.get("/", async (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const itemsPerPage = 6;
  await delay(2000); 
  // 2 seconds delay to simulate server processing

  //const itemsPerPage = 6;
  //const currentPage = parseInt(req.query.page) || 1; 
  // Use page from query string, default to 1 if not provided
  const description = req.query.description || '';

  // Build query object based on filter conditions
  let query = {};
  if (description) {
      query.description = description;
  }

  // Count total items that match the query
  const totalItems = await Listing.countDocuments(query);
  
  // Calculate total pages based on total items and items per page
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  // Fetch the data for the current page
  const data = await Listing.find(query)
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);



  // Render the view with the required data
  res.render('listing/index.ejs', {
      data,
      currentPage,
      totalPages,
      description
  });
});

//error handler
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
});

app.use((err, req, res, next) => {
  let {statusCode=500,message="something going to wrong!"}= err;
  res.status(statusCode).render("error.ejs",{message});
  
});
//port 
app.listen(port, () => {
  console.log("Server connected to sayak",port);
});