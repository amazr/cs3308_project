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
        cards: unsavedCards,
        lists: []
    };
}

function clearCardDeck() {
    unsavedCards = [];
}

function addCardToResponse(newTitle, newCurrentTemp, newConditions, imageSource, timeTo) {
    unsavedCards.push({
        title: newTitle,
        currentTemp: newCurrentTemp,
        conditions: newConditions,
        imageSource: imageSource,
        timeTo: timeTo
    });
}

function KtoF(tempK) {
    return Math.ceil(((tempK-273.15)*1.8)+32);
}

function KtoC(tempK) {
    return K-273.15;
}

function getWeatherImage(condition) {
    if (condition === "Clouds" || condition === "Mist" || condition === "Haze") {
        return "img/cloudy.png";
    }
    else if (condition === "Snow") {
        return "img/snow.png";
    }
    else if (condition === "Clear") {
        return "img/sunny.png";
    }
    else if (condition === "Rain") {
        return "img/rainy.png";
    }
    else {
        return "error.png";
    }
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
        response.lists = req.session.user.lists;
    }
    console.log(response.lists);
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
                if (err || match === null) res.redirect('/');                       //TODO - login error 
                if (match) {
                    clearCardDeck();
                    req.session.user = {
                        name: user.username,
                        isLoggedIn: true,
                        lists: user.lists
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

/** TODO: consider using the destination name from google's api to pass into openweather? or maybe use google places somewhere in here!
 * A post route for '/getPlace'. Called when a user wishes to create a weather card. It calls the correct API's and sends the correct information to front-end
 * @returns This route redirects to '/'. Passes 'invplace' if there was an error, else it will pass weather and destination stuff. 
 */
app.post('/getPlace', (req,res) => {
    let response = createNewResponse();
    let urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.newPlace}&appid=${process.env.OPENWEATHER}`
    request(urlWeather, (error, resp, body) => {
        if (!error && resp.statusCode == 200) { //On success
            let weatherJSON = JSON.parse(body);
            let origin = "Boulder";     //This is a placeholder, eventually get from req.session! (or maybe a slider)
            let destination = weatherJSON.name;
            let imageSource = getWeatherImage(weatherJSON.weather[0].main);
            let urlGoogle = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE}`;
            request(urlGoogle, (error, response, body) => {
                if (!error && response.statusCode == 200) { //On Success
                    let googleJSON = JSON.parse(body);
                    let name = googleJSON.destination_addresses[0];
                    let timeTo = `From ${googleJSON.origin_addresses[0]}: ${googleJSON.rows[0].elements[0].duration.text}`; //A bug with undefined travel times!
                    addCardToResponse(name, KtoF(weatherJSON.main.temp), weatherJSON.weather[0].main, imageSource, timeTo);
                    res.redirect('/');
                }
                else {                                      //On Failure
                    response.messages.push("invplace");
                    res.render('pages/index', response);
                }
            });
        }
        else {      //IF A PLACE WAS INVALID
            response.messages.push("invplace");
            res.render('pages/index', response);
        }
    });
});

app.post('/save-list', (req,res) => {
    let response = createNewResponse();

    //This object should follow the listSchema defined in user.js
    //Maybe open up something and ask the user for a name?
    let listItem = { 
        name: "example", 
        locations: [] 
    };

    //Make sure the user has some cards and then find the user and update the database with the new list
    if (unsavedCards.length >= 1)
    {
        for (let i = 0; i < unsavedCards.length; i++) 
        {
            listItem.locations.push(unsavedCards[i].title);
        }
        userModel.findOneAndUpdate(
            //Field 1: Query
        {
            username: req.session.user.name,
        },
            //Field 2: Update (pushed listItem to users lists array)
        { 
            $push: { lists: listItem  }
        },
        function (error, success)
        {
            if (error) 
            { 
                console.log(error);
            }
        });
    }
    res.redirect('/');
});

//Test comment
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
