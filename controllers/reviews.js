
const Listing = require("../models/listing");
const Review = require("../models/review.js");
//review post
module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    //console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new review creted!");
  
    console.log("new review saved");
    res.redirect(`/listing/${listing._id}`);
    
};

//review route delete
module.exports.deleteReview =async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted!");
  res.redirect(`/listing/${id}`);
  };
