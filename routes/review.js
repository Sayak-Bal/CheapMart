
const express = require("express");
const router = express.Router({mergeParams:true  });
//dealing with nested routes, 
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn,isReviewAuthor}= require("../middleware.js")
const ReviewControllers = require("../controllers/reviews.js");
//review serverside vailaton


//review post
router.post("/",validateReview,isLoggedIn,
  wrapAsync(ReviewControllers.createReview));
//review route delete
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(ReviewControllers.deleteReview));

  module.exports = router;