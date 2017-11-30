var middlewareObj = {};
var Todo = require("../models/todo");
var Comment = require("../models/comment");

middlewareObj.checkTodoOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Todo.findById(req.params.id, function(err, foundTodo) {
           if (err){
               res.redirect("back");
           } else {
               if (foundTodo.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that");
                   res.redirect("/todos/" + req.params.id);
               }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back"); 
    }
};
    

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment) {
           if (err){
               req.flash("error", "Todo Not Found");
               res.redirect("back");
           } else {
               if (foundComment.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that");
                   res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back"); 
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/");
};

middlewareObj.landingLogCheck = function(req, res, next){
    if (!req.isAuthenticated())
        return next();
    req.flash("error", "You're already logged in");
    res.redirect("/todos");
}

middlewareObj.isAdmin = function(req, res, next){
    if (req.isAuthenticated() && req.user.username === "admin"){
        return next();
    }
    req.flash("error", "You don't have permission to do that");
    res.redirect("/todos");
};

module.exports = middlewareObj;