const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//campground Schema

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{name:"Lake Laogai",
// 	 image: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&h=350",
// 	 description: "People come here for vacation, no mind control here whatsoever. Calm Lake nothing to see here"
// 	}, (err, campground)=>{
// 		if(err){
// 			console.log(err);
// 		} else{
// 			console.log("Newly Created Campground");
// 			console.log(campground);
// 		}
// 	});

// const campgrounds = [
// 		{name:"Lake Galena", image:"https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 		{name:"Lake Laogai", image: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 		{name:"Earth Kingdom", image:"https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 		{name:"Ba Sing Se", image:"https://images.pexels.com/photos/2365457/pexels-photo-2365457.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 		{name:"Lake Galena", image:"https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 		{name:"Lake Laogai", image: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 		{name:"Earth Kingdom", image:"https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 		{name:"Ba Sing Se", image:"https://images.pexels.com/photos/2365457/pexels-photo-2365457.jpeg?auto=compress&cs=tinysrgb&h=350"}
// 	]


app.get("/", (req, res, next) => {
    res.render("landing");
});

//INDEX-show all campgrounds
app.get("/campgrounds", (req, res, next) => {
    //get all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { campgrounds: allCampgrounds });
        }
    });
});

//CREATE-where we add a new campground to the DB
app.post("/campgrounds", (req, res, next) => {
    //get data from form and add to campgrounds array
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const newCampground = { name: name, image: image, description: desc }
    //create a new campground and save to DB
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW-show form to create new campground
app.get("/campgrounds/new", (req, res, next) => {
    res.render("new");
});

//SHOW- will show more information about one campground
app.get("/campgrounds/:id", (req, res, next) => {
    //find the campground with provided ID
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("show", { campground: foundCampground });
        }
    });
});
app.listen(3000, function () {
    console.log("YelpCamp Started")
});