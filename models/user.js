const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    lists: Array
});

const user = mongoose.model("user", userSchema);
module.exports = user;