const express    = require("express");
const router     = express.Router();
const Campground = require("../models/campground");
const Comment    = require("../models/comment");

// NEW - ADDING A NEW COMMENT
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			res.render("comments/new",{campground: campground});
		}
	});
});

// POST - CREATING A NEW COMMENT
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
	//find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error","Something went wrong");
					console.log(err);
				}else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Successfully added comment");
					res.redirect("/campgrounds/"+ campground._id);
				}
			});
		}
	});
});

// EDIT - Route
router.get("/campgrounds/:id/comments/:comment_id/edit", checkcommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});

		}
	});
});

//Update Route
router.put("/campgrounds/:id/comments/:comment_id", checkcommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// Comment destroy
router.delete("/campgrounds/:id/comments/:comment_id", checkcommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be looged in to do that");
	res.redirect("/login");
}

function checkcommentOwnership(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundcomment){
			if(err){
				req.flash("error","Comment not found");
				res.redirect("back");
			}else{
				//does user own the comment
				if(foundcomment.author.id.equals(req.user._id)){
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