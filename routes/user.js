const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../authMiddleware.js");
const usersController = require("../controllers/users.js");

//signup and login routes
router.route("/signup")
.get(usersController.renderSignUpForm)
.post(wrapAsync(usersController.signUp));

router.route("/login")
.get(usersController.renderloginForm)
.post(saveRedirectUrl, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), usersController.login);

router.get("/logout", usersController.logout);
module.exports = router;