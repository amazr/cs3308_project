const express = require('express');
const bcrypt = require("bcrypt");
const app = express();

/* Model requirements */
const userModel = require('./models/user');


/* APP GET ROUTES*/

//Index route
app.get('/', (req,res) => {
    let response = {
        isLoggedIn: false,
        username: ""
    };

    if (req.session.user) {
        response.isLoggedIn = req.session.user.isLoggedIn;
        response.username = req.session.user.name;
    }
    res.render('pages/index', response);
});

/* APP POST ROUTES */ 
/* User Login route */
app.post('/login', (req,res) => {
    let response = {
        isLoggedIn: false,
        username: ""
    };

    userModel.findOne({
        username: req.body.username,
    },
    (err,user) => {
        if (err) console.log(err);
        else if (!user) console.log("No user found");                    
        else {
            bcrypt.compare(req.body.password, user.password, (err, match) => {
                if (err || match === null) res.redirect('/');
                if (match) {
                    req.session.user = {
                        name: user.username,
                        isLoggedIn: true
                    };
                    res.redirect('/');
                }
            });
        }
    });
});

//User registration route
app.post('/register', (req,res) => {
    //For more info on this read about mongoose models and schemas and see the /models dir
    let user = new userModel(req.body);

    let response = {
        isLoggedIn: false,
        username: ""
    };

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
        res.redirect('/');   //This will need to redirect to a register page
    });
});

//User logout route
app.post('/logout', (req,res) => {
    if(req.session.user) {
        delete req.session.user;
    }
    res.redirect('/');
});

module.exports = app