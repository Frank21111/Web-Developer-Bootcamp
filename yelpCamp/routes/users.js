const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utilities/catchAsync.js");
const passport = require("passport");
const userController = require("../controllers/users.js")

router.route("/register")
.get((req,res)=>{res.render("./users/register.ejs");})
.post( wrapAsync(userController.newUser))

router.route("/login")
.get((req,res)=>{ res.render("./users/login.ejs");})
.post(passport.authenticate("local", {failureFlash: true, failureRedirect : "/users/login"}), userController.login)

router.get("/logout", userController.logout)

module.exports = router;