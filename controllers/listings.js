const Listing = require("../models/listing.js")



//index route
module.exports.index = async (req, res) => {
    let data = await Listing.find({});
    res.render("listing/index.ejs", { data });
};

// New route
module.exports.renderNewForm = async(req, res) => {
    res.render("listing/new.ejs");
};

// Show route
module.exports.showListing = async (req, res, next) => {
   let { id } = req.params;
   const list = await Listing.findById(id).populate({
       path:"reviews",
       populate:{
           path:"author",
       },
   })
.populate("owner");
   if (!list) {
       req.flash("error", "Listing you  requested for does not exsit !");
       //return next(new ExpressError(404, "Listing not found"));
       //res.redirect("/listing");
       res.redirect("/");
   }
   //console.log(list);
   res.render("listing/show.ejs", { list });
};

// Create route validateListing
module.exports.createListing =async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"..","filename");

   const newListing = new Listing(req.body.listing);
   newListing.image ={url,filename};
   newListing.owner = req.user._id;
   await newListing.save();
   req.flash("success", "New Listing Created");
   //res.status(201).redirect("/listing");
   res.status(201).redirect("/");
};

// Edit route
module.exports.editListing = async (req, res, next) => {
    let { id } = req.params;
   const listing = await Listing.findById(id);
   if (!listing) {
       req.flash("error", "Listing you  requested for does not exsit !");
       //res.redirect("/listing");
       res.redirect("/");
      // return next(new ExpressError(404, "Listing not found"));
   }
let originalImageUrl = listing.image.url;
originalImageUrl = originalImageUrl.replace("/upload","/upload/w_200")

   res.render("listing/edit.ejs", { listing,originalImageUrl });
};

// Update route
module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
   
    if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = {url,filename};    
    await updatedListing.save();
    }
   //if (!updatedListing) {
   //  return next(new ExpressError(404, "Listing not found"));
  // }
   req.flash("success","new lisiting updated!");
   //res.redirect("/listing");
   res.redirect("/");
};

// Delete route
module.exports.deleteListing = async (req, res, next) => {
   let { id } = req.params;
   let dellisting = await Listing.findByIdAndDelete(id);
   if (!dellisting) {
       return next(new ExpressError(404, "Listing not found"));
   }
   req.flash("success","lisiting is deleted !");
   //res.status(204).redirect("/listing");
   res.status(204).redirect("/");
};
