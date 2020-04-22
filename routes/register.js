const userModel = require('../models/user');
const helpers = require('./helpers');
const bcrypt = require("bcrypt");

function registerGet(req, res) 
{
    let response = helpers.createNewResponse(req.session.cards);

    //If the user is logged in, set the response information
    //Else set the response page to register
    if (req.session.user) 
    {
        response.isLoggedIn = req.session.user.isLoggedIn;
        response.username = req.session.user.name;
    }
    else 
    {
        response.page = "register"
    }
    
    res.render('pages/index', response);
}

function registerPost(req, res)
{
    let user = new userModel(req.body);

    let response = helpers.createNewResponse(req.session.cards);

    //If the user did not enter a username in the form
    if (!req.body.username) 
    {
        response.messages.push("usernameempty");
        response.page = "register";
        res.render('pages/index', response);
    }
    else 
    {
        userModel.findOne({
            username: req.body.username,
        },
        (err,person) => {
            if (err) console.log(err);
            //If username already exists
            else if (person) 
            {
                response.messages.push("invuser");
                response.page = "register";
            }
            //If passwords do not match
            if (req.body.password != req.body.r_password) 
            {
                response.messages.push("passwordmatch");
                response.page = "register";
            }
            //If no password was entered
            else if (!req.body.password || !req.body.r_password) 
            {
                response.messages.push("passwordempty");
                response.page = "register";
            }
            //Form was filled out successfully, user will be added to mongo below
            else 
            {
                bcrypt.hash(req.body.password, 10, (err, hash) => {                     
                    user.password = hash;                                              
                    user.save((err) => 
                    {                                                
                        if (err) throw "Error connecting to mongoose in register"
                        else 
                        {
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
}

module.exports = {
    registerGet: function(req, res)
    {
        registerGet(req, res);
    },
    registerPost: function(req, res)
    {
        registerPost(req, res);
    }
}