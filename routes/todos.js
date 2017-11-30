var express = require("express");
var router = express.Router();
var Todo = require("../models/todo");
var middleware = require("../middleware/index");
var moment = require("moment");

//INDEX TODO
router.get("/", middleware.isLoggedIn, function(req, res){
    
    Todo.find({}, function(err, allTodos){
       if(err){
           console.log(err);
       } else {
          allTodos.forEach(function(todo){
                  if (moment(todo.expiration_date) < moment())
                  Todo.findByIdAndRemove(todo._id, function(err, removedTodo){
                      if (err){
                          console.log(err);
                      }
                  });
          });
       }
    });    
    
  // Get all todos from DB
    Todo.find({}, function(err, allTodos){
       if(err){
           console.log(err);
       } else {
          res.render("todos/index",{todos:allTodos});
       }
    });
});


//CREATE TODO
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to todos array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var date = req.body.expiration_date;
    console.log(req.user._id);
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newTodo = {name: name, image: image, description: desc, expiration_date: date,  author: author};
    if (moment(newTodo.expiration_date) < moment()){
        req.flash("error", "Invalid date");
        res.redirect("/todos/new");
    } else {
    // Create a new todo and save to DB
    Todo.create(newTodo, function(err, newlyCreated){
        if(err){
            req.flash("error", err.message);
            console.log(err);
        } else {
            req.flash("success", "Successfully added your todo");
            //redirect back to todos page
            res.redirect("/todos");
        }
    });
    }
});

//SHOW NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("todos/new"); 
});

// SHOW - shows more info about one todo
router.get("/:id", middleware.isLoggedIn, function(req, res){
    //find the todo with provided ID
    Todo.findById(req.params.id).populate("comments").exec(function(err, foundTodo){
        if(err){
            console.log(err);
        } else {
            console.log(foundTodo);
            //render show template with that todo
            res.render("todos/show", {todo: foundTodo});
        }
    });
});

//EDIT todo route
router.get("/:id/edit", middleware.checkTodoOwnership,function(req, res) {
    Todo.findById(req.params.id, function(err, foundTodo){
            res.render("todos/edit", {todo: foundTodo});      
    });
});

//UPDATE todo route
router.put("/:id", middleware.checkTodoOwnership,function(req, res){
    Todo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, updatedTodo){
        if (err){
            res.redirect("/todos");
        } else {
            res.redirect("/todos/" + req.params.id);
        }
    });
});

// DESTROY todo ROUTE
router.delete("/:id", middleware.checkTodoOwnership,function(req, res){
   Todo.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/todos");
      } else {
          req.flash("success", "Todo deleted");
          res.redirect("/todos");
      }
   });
});


module.exports = router;