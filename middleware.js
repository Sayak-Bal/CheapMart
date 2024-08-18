const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
   // console.log(req.user);
   // console.log(req.path,"..",req.originalUrl);
  req.session.redirectUrl = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error"," you must be loggged in to create lisiting!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveredirectUrl = (req,res,next)=>
{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let lisiting = await Listing.findById(id);
    if(!lisiting.owner.equals(res.locals.currUser._id)){
        req.flash("error","you don't hava permission");
        return res.redirect(`/listing/${id}`);
    }
    next();
    }

    module.exports.validateReview = (req,res,next) =>{
        let {error} = reviewSchema.validate(req.body);
        if(error){
          let errMsg = error.details.map((el)=> el.message).join(",");
          throw new ExpressError(400,errMsg);
        }else{
          next();
        }
      };

      module.exports.isReviewAuthor = async (req,res,next)=>{
        let {id,reviewId} = req.params;
        let review = await Review.findById(reviewId);
        if(!review.author.equals(res.locals.currUser._id)){
            req.flash("error","you don't hava permission");
            return res.redirect(`/listing/${id}`);
        }
        next();
        }