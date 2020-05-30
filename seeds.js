const mongooose = require("mongoose");
const Comment = require("./models/comment");
const Campground = require("./models/campground");


var data = [
    {
        name: "Spiti Valley, Himachal Pradesh", 
        img: "https://toib.b-cdn.net/wp-content/uploads/2017/08/spiti-valley-himachal-pradesh.jpg",
		description: "First on our list is, Spiti Valley nestled in the Keylong district of Himachal Pradesh. It is one of             the best camping sites in India. Adventure enthusiasts and trekkers from all over the world come here to explore               this untouched region in the Himalayas. There are barren hills, beautiful lakes, monasteries, lush valleys and                 stark beauty of nature. May to July are the perfect months for the adventure."
	},
    {
        name: "Chandratal Lake, Himachal Pradesh", 
        img: "https://toib.b-cdn.net/wp-content/uploads/2017/08/chandratal-lake-himachal-pradesh.jpg",
		description: "The high-altitude Chandratal Lake is one of the best places to visit in Himachal Pradesh for natural             bliss. Situated about 4,300 meters above sea level, you can get to the lake shores after a trek. Popularly known as             ‘Lake of    Moon’ it’s a beauty which enchants you. Camping here provides a thrilling experience of natural bliss. The         view of the lake    reflecting the moonlight is definitely ethereal."
    },
    {
        name: "Solang Valley, Manali", 
        img: "https://toib.b-cdn.net/wp-content/uploads/2017/08/solang-valley-manali.jpg",
        description: "One of the best camping sites in India, Solang Valley in Manali attracts visitors from the far ends of           the world. The verdant spread of lush greenery, the gurgling of a stream nearby and the host of thrilling adventures,           makes camping all the more fun. Enjoy the bliss of the mountains or try skiing, trekking, rock climbing, rappelling,           river crossing, paragliding, ATV Ride, zorbing, bonfire, and much more."
    }
]

function seedDB(){
// 	REMOVE  all campground
	Campground.deleteMany({},function(err){
// 		if(err){
// 			console.log(err);
// 		}
// 		console.log("Campground removed");
// 		//Adding a new campground
// 		data.forEach(function(seed){
// 			Campground.create(seed, function(err, campground){
// 				if(err){
// 					console.log(err);
// 				}else{
// 					console.log("Campground added");
// 					//added a comment
// 					Comment.create(
// 						{
// 							text: "This place is great, but I wish there was internet",
// 							author: "Homer"
// 					},function(err, comment){
// 						if(err){
// 							console.log(err);
// 						}else{
// 							campground.comments.push(comment);
// 							campground.save();
// 							console.log("Added a new comment");
// 						}
// 					});
// 				}
// 			});
// 		});
 	});
  }


module.exports = seedDB;