const express = require("express");
const router  = express.Router();
const Campground = require("../models/campground");


// INDEX PAGE
router.get("/campgrounds",function(req, res){
// 	GET ALL CAMPGROUND
	Campground.find({},function(err, campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/campgrounds",{campgrounds:campgrounds});
		}
	});
});

// CREATE - ADDIND A NEW DATA IN DB
router.post("/campgrounds", isLoggedIn, function(req, res){
	//get the new data
	var name = req.body.name;
	var image = req.body.image;
	var description= req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name:name,img:image,description:description, author: author,price: price};
	// create a new campgrounds and save to mongodb
	Campground.create(newCampground,function(err, campground){
		if(err){
			console.log(err);
		}else{
			//redirect to campgrounds
			res.redirect("/campgrounds");
		}
	});
});

// NEW-CREATING A NEW DATABASE
router.get("/campgrounds/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// SHOW MORE INFO ABOUT ONE CAMPGROUND
router.get("/campgrounds/:id",function(req, res){
// 	find the camp ground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
		if(err){
			console.log(err);
		}else{
			// 	render show template
			res.render("campgrounds/show",{campground: foundcampground});
		}
	});
});

// EDIT - campground route
router.get("/campgrounds/:id/edit", checkcampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundcampground){
				res.render("campgrounds/edit",{campground: foundcampground});
	});
});

// UPDATE - campground route
router.put("/campgrounds/:id", checkcampgroundOwnership, function(req, res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			//redirect somewere
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY - campground Route
router.delete("/campgrounds/:id", checkcampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

// middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be looged in to do that");
	res.redirect("/login");
}

function checkcampgroundOwnership(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundcampground){
			if(err){
				req.flash("error","Campground not found");
				res.redirect("back");
			}else{
				//does user own the campground
				if(foundcampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have the permission to do that");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error","You need to be logeed in to do that");
		res.redirect("back");
	}
}

module.exports = router;
