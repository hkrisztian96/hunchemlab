var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/index");

//root route
router.get("/", middleware.landingLogCheck,function(req, res){
    res.render("landing");
});

//handling login logic
router.post("/", passport.authenticate("local", {successRedirect: "/todos", failureRedirect: "/", failureFlash: "Wrong Username or Password", successFlash: "Logged You In"}) ,function(req, res) {

});

//show register form
router.get("/register", middleware.isAdmin, function(req, res) {
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res) {
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if (err){
           req.flash("error", err.message);
           console.log(err);
           return res.render("register");
       }
       req.flash("success", "Successful Registration");
       res.redirect("/register");
   }); 
});

//logout route
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Logged You Out");
   res.redirect("/");
});


module.exports = router;