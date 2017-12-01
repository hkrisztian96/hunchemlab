var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    moment          = require("moment"),
    flash           = require("connect-flash"),
    methodOverride  = require("method-override"),
    Todo            = require("./models/todo"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local");
    
var commentRoutes   = require("./routes/comments"),
    todoRoutes      = require("./routes/todos"),
    indexRoutes     = require("./routes/index");
    
mongoose.connect("mongodb://localhost/hunchemlab");
//mongoose.connect(process.env.DATABASEURL);


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// //PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "hunchemprotect",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passes user data to every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.today = moment();
    next();
});


app.use("/", indexRoutes);
app.use("/todos/:id/comments", commentRoutes);
app.use("/todos", todoRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});