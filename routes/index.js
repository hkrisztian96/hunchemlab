var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/index");
var Todo = require("../models/todo");
var moment = require("moment");

//root route
router.get("/", middleware.landingLogCheck,function(req, res){
    res.render("landing");
});

//handling login logic
router.post("/", function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
        req.flash("error", err.message);
        console.log(err);
        return res.redirect("/");
    }
    if (!user) { 
        req.flash("error", "Wrong username or password");
        return res.redirect("/");
    }
    req.logIn(user, function(err) {
      if (err) { 
        req.flash("error", err.message);
        console.log(err);
        return res.redirect("/");
      }
      // Get all todos from DB
    Todo.find({}, function(err, allTodos){
       if(err){
           req.flash("error", "Something went wrong :(");
           console.log(err);
       } else {
          // Delete expired todos from DB
          allTodos.forEach(function(todo){
                  if (moment(todo.expiration_date) < moment())
                  Todo.findByIdAndRemove(todo._id, function(err, removedTodo){
                      if (err){
                          req.flash("error", "Something went wrong :(");
                          console.log(err);
                      }
                  });
          }); 
       }
    });
      return res.redirect('/todos');
    });
  })(req, res, next);
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
           return res.redirect("/register");
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