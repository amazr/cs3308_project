const express = require('express');
const bcrypt = require("bcrypt");
const request = require('request');

const app = express();

/* Model requirements */
const userModel = require('./models/user');

/* Global variable for logged out user or unsaved cards list*/
let unsavedCards = [];

/* Helper Functions */
/**
 * This function was created to keep a standardized response when rendering pages at the end of a route.
 * @returns A response JSON object
 */

function createNewResponse() {
    return {
        isLoggedIn: false,
        username: "",
        page: "",
        messages: [],
        cards: unsavedCards
    };
}

function addCardToResponse(newTitle, newCurrentTemp, newConditions) {
    unsavedCards.push({
        title: newTitle,
        currentTemp: newCurrentTemp,
        conditions: newConditions
    });
}

function KtoF(tempK) {
    return Math.ceil(((tempK-273.15)*1.8)+32);
}

function KtoC(tempK) {
    return K-273.15;
}


/* APP GET ROUTES*/

/**
 * get route for '/'
 *
 * @param {JSON} req.session - Handeled automatically by express-sessions
 * @returns {JSON} A JSON object that is fed to index.ejs
 */
app.get('/', (req,res) => {
    let response = createNewResponse();

    if (req.session.user) {
        response.isLoggedIn = req.session.user.isLoggedIn;
        response.username = req.session.user.name;
    }
    console.log(response);
    res.render('pages/index', response);
});

/**
 * A get route for '/register', renders the register form
 * @param {JSON} req.session - Handeled by express-sessions
 * @returns {JSON} A JSON object that is fed to index.ejs
 */
app.get('/register', (req,res) => {
    let response = createNewResponse();

    if (req.session.user) {
        response.isLoggedIn = req.session.user.isLoggedIn;
        response.username = req.session.user.name;
    }
    else {
        response.page = "register"
    }
    res.render('pages/index', response);
});

/**
 * A get route for '/addCard', update user list and reload page
 */


/* APP POST ROUTES */

/**
 * A post route for '/login'. When called a user is either logged in or they aren't
 * @param {String} req.body.username - Form must have field with name="username"
 * @param {String} req.body.password - Form must have field with name="password"
 * @returns {(JSON | JSON)} First it sets the req.session, then it renders index.ejs with response
 */
app.post('/login', (req,res) => {
    let response = createNewResponse();

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
/**
 * A post route for '/register'. Allows a user to create an account. Will log user if account creation is successful.
 * The form must include the following fields, named as such
 * @param {String} req.body.username
 * @param {String} req.body.password
 * @param {String} req.body.r_password
 * @returns {(JSON | JSON)} On failure this route will reload get'/register'. On success it will pass response to index.ejs and log the user in.
 */
app.post('/register', (req,res) => {
    //For more info on this read about mongoose models and schemas and see the /models dir
    let user = new userModel(req.body);

    let response = createNewResponse();

    if (!req.body.username) {                               //No username input
        response.messages.push("usernameempty");
        response.page = "register";
        res.render('pages/index', response);
    }
    else {
        userModel.findOne({
            username: req.body.username,
        },
        (err,person) => {
            if (err) console.log(err);                                                  //If there was a connection error
            else if (person) {//If the username already exists
                response.messages.push("invuser");
                response.page = "register";
            }
            if (req.body.password != req.body.r_password) {    //Passwords do not match
                response.messages.push("passwordmatch");
                response.page = "register";
            }
            else if (!req.body.password || !req.body.r_password) {  //No password input
                response.messages.push("passwordempty");
                response.page = "register";
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {                     //Encrypt the password using bcrypt
                    user.password = hash;                                               //Update the model password with the encrypted one
                    user.save((err) => {                                                //Save the new user to the DB
                        if (err) throw "Error connecting to mongoose in register"
                        else {
                            req.session.user = {
                                name: req.body.username,
                                isLoggedIn: true
                            };
                        }
                    });
                });
            }
            res.render('pages/index', response);
        });
    }
});

//User logout route
/**
 * A post route for '/logout'. Upon success the user is logged out and their session is cleared.
 * @param {JSON} req.session.user - If there is no session nothing happens.
 * @returns This route redirects to '/' but does not pass it anything directly (everything is handeled by express-sessions).
 */
app.post('/logout', (req,res) => {
    if(req.session.user) {
        delete req.session.user;
    }
    res.redirect('/');
});

app.post('/getPlace', (req,res) => {
    let response = createNewResponse();
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.newPlace}&appid=${process.env.OPENWEATHER}`
    request(url, (error, resp, body) => {
        if (!error && resp.statusCode == 200) { //On success
            let bodyJSON = JSON.parse(body);
            addCardToResponse(bodyJSON.name, KtoF(bodyJSON.main.temp) ,bodyJSON.weather[0].main)
            res.redirect('/');
        }
        else {      //IF A PLACE WAS INVALID
            response.messages.push("invplace");
            res.render('pages/index', response);
        }
    });
});


/* THESE ARE EXAMPLE POSTS FOR TESTING API HOOKUPS! THEY WORK! :) */
app.post('/testWeather', (req,res) => {
    let city = "London";
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHER}`
    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) { //On Success
            console.log(JSON.parse(body));
        }
        else {                                      //On Failure
            console.log(error);
        }
    });
    res.redirect('/');
});

app.post('/testGoogle', (req,res) => {
    let origin = "Boulder";
    let destination = "Denver";
    let url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE}`;

    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) { //On success
            console.log(body);
        }
        else {                                      //On Failure
            console.log(error);
        }
    });
    res.redirect('/');
});

app.post('/testPlaces', (req,res) => {
    let response = createNewResponse();
    let test = "a";
    let url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${test}&inputtype=textquery&fields=formatted_address,name&key=${process.env.GOOGLE}`;
    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) { //On success
            //JSON.parse(body).candidates[i].name
            console.log(body);

        }
    });
    res.redirect('/');
});

module.exports = app
