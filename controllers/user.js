
const User = require("../models/user")
//create signup form
module.exports.signupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

//post signup form
module.exports.signup = async (req, res) => {
        try {
            let { username, email, password } = req.body;
            const newUser = new User({ email, username });
            const registerUser = await User.register(newUser, password);
            //console.log(registerUser);
            req.flash("success", "Welcome to Dakubaba World");
            // res.redirect("/listing"); 
            res.redirect("/"); 
        } catch (e) {
            req.flash("error", e.message); // Send the error message to flash
            res.redirect("/signup"); 
        }
    };

// create login form
module.exports.loginForm =(req,res)=>{
    res.render("users/login.ejs");
};
//post login form 
module.exports.login = async(req,res)=>{
    req.flash("success", "Welcome back Dakubaba World");
    let redirectUrl = res.locals.redirectUrl || "/";
    res.redirect( redirectUrl );
};
// loggout
module.exports.logout =(req,res)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out now");
       // res.redirect("/listing");
        res.redirect("/"); 
    })
};
