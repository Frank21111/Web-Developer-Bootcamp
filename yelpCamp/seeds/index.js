const mongoose = require("mongoose");
const cities = require("./cities.js")
const City = require("../models/city.js")
const Campground = require("../models/campground");
const {descriptors, places} = require("./seedHelpers")

const db = mongoose.connection;

mongoose.connect("mongodb://localhost:27017/yelpCamp", {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
});

db.on("open", ()=>console.log("Connection with mongo established"));
db.once("error", console.error.bind(console, "Something went wrong :("));

const sample = (array) => array[Math.floor(Math.random()*array.length)];

const seedDB = async (name) => {
    await Campground.deleteMany({});
    for(let i = 0; i<100; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
            title : `${sample(descriptors)} ${sample(places)}`,
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            image : [{url : "https://source.unsplash.com/collection/483251", filename : "RandomFilename"}],
            price : `${Math.floor(Math.random()*1000)}`,
            description : "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia amet voluptatem a, aliquid, animi dicta, eius adipisci et reiciendis quis alias? Aliquid harum ullam voluptate similique esse dolorum eligendi. Id?",
            owner: "61038f6f062ba01ffcb71f9f"
        });
        await camp.save();
    }
}

seedDB().then(()=>mongoose.connection.close);
//City.insertMany(cities);

