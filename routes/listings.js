const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn,isOwner } = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js");
//cloud
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });
const User = require("../models/user.js");

// Error handler by schema server-side validation
// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };

//reconstrust for 
// better readibity and short and onetime use path
// router.route()
// New route
router.get("/new", 
    isLoggedIn,
    listingcontroller.renderNewForm);
//seach     



router
    .route("/")
    // Index route
   .get(wrapAsync(listingcontroller.index))
    // Create post
     .post( 
        isLoggedIn,
        //validListing
        upload.single('listing[image]'),
        wrapAsync(listingcontroller.createListing));
    


router
        .route("/:id")
        // Show route
        .get(wrapAsync(listingcontroller.showListing))

        // Update route
        .put( 
            isLoggedIn,
            isOwner,
            //validListing
            upload.single('listing[image]'),
            wrapAsync(listingcontroller.updateListing))

        // Delete route
        .delete(
            isLoggedIn,
            isOwner, 
            wrapAsync(listingcontroller.deleteListing));



// Edit route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingcontroller.editListing));



 module.exports = router;

/*
    // Index route
router.get(  "/", wrapAsync(listingcontroller.index) );

// New route
router.get("/new", isLoggedIn,listingcontroller.renderNewForm);

// Show route
router.get("/:id", wrapAsync(listingcontroller.showListing));

// Create route validateListing
router.post("/", isLoggedIn,wrapAsync(listingcontroller.createListing));

// Edit route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingcontroller.editListing));

// Update route
router.put("/:id",  isLoggedIn,isOwner,wrapAsync(listingcontroller))

// Delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingcontroller.deleteListing));
*/

