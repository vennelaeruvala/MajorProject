const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignUpForm) //signup get
.post(wrapAsync(userController.signup)) //post signup

router.route("/login")
.get(userController.renderLoginForm) //get login
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect: "/login",
    failureFlash: true
    }),
    userController.login,
); //post login

//For LOGOUT
router.get("/logout",userController.logout);
module.exports=router;