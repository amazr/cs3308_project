const express = require('express');
const request = require('request');
const helpers = require('./helpers');

//Requirements for route behavior
const home = require('./home');
const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const getPlace = require('./getPlace');
const saveList = require('./saveList');
const getList = require('./getList');
const setLocation = require('./setLocation');

const app = express();

/* APP GET ROUTES*/

/**
 * get route for '/'
 *
 * @param {JSON} req.session - Handeled automatically by express-sessions
 * @returns {JSON} A JSON object that is fed to index.ejs
 */
app.get('/', (req,res) => 
{
    home.homeGet(req, res); 
});

/**
 * A get route for '/register', renders the register form
 * @param {JSON} req.session - Handeled by express-sessions
 * @returns {JSON} A JSON object that is fed to index.ejs
 */
app.get('/register', (req,res) => 
{
    register.registerGet(req, res);
});

/**
 * A get route that is intended to fetch a users specific list
 */
app.get('/list/:name', (req,res) => 
{
    getList.getListGet(req, res);
});

app.get('/clearList', (req,res) =>
{
    req.session.cards = [];
    res.redirect('/')
});


/* APP POST ROUTES */

/**
 * A post route for '/login'. When called a user is either logged in or they aren't
 * @param {String} req.body.username - Form must have field with name="username"
 * @param {String} req.body.password - Form must have field with name="password"
 * @returns {(JSON | JSON)} First it sets the req.session, then it renders index.ejs with response
 */
app.post('/login', (req,res) => 
{
    login.loginPost(req, res);
});

/**
 * A post route for '/register'. Allows a user to create an account. Will log user if account creation is successful.
 * The form must include the following fields, named as such
 * @param {String} req.body.username
 * @param {String} req.body.password
 * @param {String} req.body.r_password
 * @returns {(JSON | JSON)} On failure this route will reload get'/register'. On success it will pass response to index.ejs and log the user in.
 */
app.post('/register', (req,res) => 
{
    register.registerPost(req, res);
});

/**
 * A post route for '/logout'. Upon success the user is logged out and their session is cleared.
 * @param {JSON} req.session.user - If there is no session nothing happens.
 * @returns This route redirects to '/' but does not pass it anything directly (everything is handeled by express-sessions).
 */
app.post('/logout', (req, res) => 
{
    logout.logoutGet(req, res);
});

/** TODO: consider using the destination name from google's api to pass into openweather? or maybe use google places somewhere in here!
 * A post route for '/getPlace'. Called when a user wishes to create a weather card. It calls the correct API's and sends the correct information to front-end
 * @returns This route redirects to '/'. Passes 'invplace' if there was an error, else it will pass weather and destination stuff. 
 */
app.post('/getPlace', (req,res) => 
{
    getPlace.getPlaceGet(req, res);
});

/**
 * A post route that saves the active list in req.session to the users list array in mongodb
 */
app.post('/saveList', (req,res) => 
{
    saveList.saveListGet(req, res);
});

app.post('/setLocation', (req, res) =>
{
    //what this needs to do is go through all the lists and reset their location as well as set a location in req.session
    setLocation.setLocationPost(req, res);
});

module.exports = app
