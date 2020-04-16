//This is a work in progress right now. The lists section needs to be thought about
//Need to figure out exactly how a list is going to be stored in the database
//The idea is to cache data in the db to reduce calls to the API

const mongoose = require('mongoose');

let listSchema = new mongoose.Schema(
    {
        name: String,
        locations: [String]
    }
);

let userSchema = new mongoose.Schema({
    username: 
    {
        type: String,
        required: true
    },
    password: 
    {
        type: String,
        required: true
    },
    lists: [listSchema]
});

const user = mongoose.model("user", userSchema);
module.exports = user;