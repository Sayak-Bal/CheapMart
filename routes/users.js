const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");

const UserController = require("../controllers/user.js");

//using router.route
router
    .route("/signup")
    .get(UserController.signupForm)
    .post(wrapAsync(UserController.signup));

router
        .route("/login")
        .get(UserController.loginForm)

        .post(saveredirectUrl,
            passport.authenticate("local",{
            failureRedirect:"/login",
            failureFlash:true,
            
        }),UserController.login);

router.get("/logout",UserController.logout);

module.exports= router;
//router.post("/signup", wrapAsync(UserController.signup));
//router.get("/login",UserController.loginForm);
/*router.post("/login", saveredirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,

}),UserController.login); */