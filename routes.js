const express = require('express');
const bcrypt = require("bcrypt");
const request = require('request');

const app = express();

/* Model requirements */
const userModel = require('./models/user');

/* Below is the response object that must be passed in every route
let response = {
        isLoggedIn: false,
        username: "",
        page: "",
        messages: []
};
*/


/* APP GET ROUTES*/

//Index route
app.get('/', (req,res) => {
    let response = {
        isLoggedIn: false,
        username: "",
        page: "",
        messages: []
    };

    if (req.session.user) {
        response.isLoggedIn = req.session.user.isLoggedIn;
        response.username = req.session.user.name;
    }
    res.render('pages/index', response);
});

app.get('/register', (req,res) => {
    let response = {
        isLoggedIn: false,
        username: "",
        page: "",
        messages: []
    };

    if (req.session.user) {
        response.isLoggedIn = req.session.user.isLoggedIn;
        response.username = req.session.user.name;
    }
    else {
        response.page = "register"
    }
    res.render('pages/index', response);
});

/* APP POST ROUTES */ 
/* User Login route */
app.post('/login', (req,res) => {
    let response = {
        isLoggedIn: false,
        username: "",
        page: "",
        messages: []
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
        username: "",
        page: "",
        messages: []
    };
    if (req.body.password != req.body.r_password) {
        response.messages.push("passwordmatch");
        response.page = "register";
    }

    //Find a user in the DB with the username passed in from the html form
    userModel.findOne({
        username: req.body.username,
    },
    (err,person) => {
        if (err) console.log(err);                                                  //If there was a connection error
        else if (person) {//If the username already exists
            response.messages.push("invuser");
            response.page = "register";
        }                               
        else if (req.body.password === req.body.r_password) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {                     //Encrypt the password using bcrypt
                user.password = hash;                                               //Update the model password with the encrypted one
                user.save((err) => {                                                //Save the new user to the DB
                    if (err) res.send(err);
                    else {
                        req.session.user = {
                            name: req.body.username,
                            isLoggedIn: true
                        };
                        res.redirect('/'); 
                    }
                });
            });
        }
        else {
            res.render('pages/index', response); 
        }
    });
});

//User logout route
app.post('/logout', (req,res) => {
    if(req.session.user) {
        delete req.session.user;
    }
    res.redirect('/');
});

app.post('/getWeather', (req,res) => {
    let city = "London";
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHER}`
    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            console.log(body);          // Print the openweather response.
          }
          else {
              console.log(error);
          }
    });
});

module.exports = app