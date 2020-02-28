const express = require('express');
const bcrypt = require("bcrypt");
const app = express();

/* Model requirements */
const userModel = require('./models/user');


/* APP GET ROUTES*/

//Index route
app.get('/', (req,res) => {
    let response = {
        isLoggedIn: false
    };

    if (req.session.user) response.isLoggedIn = true; 
    res.render('pages/index', response);
});

app.get('/login', (req,res) => {
    console.log("Attempting to login");
});

/* APP POST ROUTES */ 

//User registration route
app.post('/register', (req,res) => {
    //For more info on this read about mongoose models and schemas and see the /models dir
    let user = new userModel(req.body);

    //Find a user in the DB with the username passed in from the html form
    userModel.findOne({
        username: req.body.username,
    },
    (err,person) => {
        if (err) console.log(err);                                                  //If there was a connection error
        else if (person) console.log("Username already exists");                    //If the username already exists
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {                     //Encrypt the password using bcrypt
                user.password = hash;                                               //Update the model password with the encrypted one
                user.save((err) => {                                                //Save the new user to the DB
                    if (err) res.send(err);
                    else console.log(req.body.username + " Successfully Registered");
                });
            });
        }
        res.render('pages/index');                                                  //Re-render the page
    });
});

//User logout route
app.post('/logout', (req,res) => {
    console.log("User triggering logout");
});

module.exports = app