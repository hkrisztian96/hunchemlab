var express = require("express");
var router = express.Router({mergeParams: true});
var Todo = require("../models/todo");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");
var moment = require("moment");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find todo by id
    Todo.findById(req.params.id, function(err, todo){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {todo: todo});
        }
    });
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup todo using ID
   Todo.findById(req.params.id, function(err, todo){
       if(err){
           req.flash("error", "Oops... Something went wrong");
           console.log(err);
           res.redirect("/todos");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comments and then save
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.date = moment();
               comment.save();
               
               todo.comments.push(comment);
               todo.save();
               req.flash("success", "Successfully added comment");
               res.redirect('/todos/' + todo._id);
           }
        });
       }
   });
});

//showing EDIT FORM
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment) {
        if (err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {todo_id: req.params.id, comment: comment}); 
        }
    });
});

//COMMENTS UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            res.redirect("back");
        } else {
            res.redirect("/todos/" + req.params.id);
        }
    });
});

//COMMENTS DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/todos/" + req.params.id);
        }
    });
});


module.exports = router;