const mongoose = require("mongoose");

const citiesSchema = new mongoose.Schema({
    city: String,
    growth_from_2000_to_2013: String,
    latitude: Number,
    longitude: Number,
    population: Number,
    rank: Number,
    state: String,
});

module.exports = mongoose.model("City", citiesSchema);