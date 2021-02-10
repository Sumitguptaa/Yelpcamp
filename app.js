const express      = require("express"),
	  app          = express(),
	  bodyParser   = require("body-parser"),
	  mongoose     = require("mongoose"),
	  passport     = require("passport"),
	  LocalStrategy= require("passport-local"),
	  methodOverride = require("method-override"),
	  flash        = require("connect-flash"),
	  Campground   = require("./models/campground"),
	  Comment      = require("./models/comment"),
	  User         = require("./models/user"),
	  seedDB       = require("./seeds.js");

const campgroundRoutes = require("./routes/campgrounds"),
	  commentsRoutes   = require("./routes/comments");
	  
const port = process.env.PORT || 3000;
const database = process.env.DATABASEURL || "mongodb://localhost:27017/Yelpcamp";

mongoose.connect(database, {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine","ejs");
// mongoose.set("useFindAndModify", false);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+ "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seedind the DB

// PASSPORT CONFIG
app.use(require("express-session")({
	secret: "This is Yelpcamp",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(campgroundRoutes);
app.use(commentsRoutes);

// HOME PAGE
app.get("/",function(req, res){
	res.render("campgrounds/home");
});

// ============
// AUTH ROUTES        route method is not accepting for auth
// ============

// SHOW REGISTER FORM

	  
app.get("/register", function(req, res){
	res.render("campgrounds/register");
});

// handel sign up logic
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error",err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success","Welcome to Yelpcamp" + user.username);
			res.redirect("/campgrounds");
		});
	});
});

// show login form
app.get("/login", function(req, res){
	res.render("campgrounds/login");
});

// handeling login logic
app.post("/login",passport.authenticate("local", {
		successRedirect: "/campgrounds",
		faliureRedirect: "/login"
	}), function(req, res){	
});

// logout route
app.get("/logout", function(req, res){
	req.logout();
	req.flash("success","Logged you out");
	res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

	
// STARTING THE SERVER
app.listen(port,function(){
	console.log("Yelpcamp Server is started");
});