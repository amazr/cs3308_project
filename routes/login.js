const userModel = require('../models/user');
const helpers = require('./helpers');
const bcrypt = require("bcrypt");



//This function has form validation and error handling work needed
function loginPost(req, res) 
{
    let response = helpers.createNewResponse(req.session.cards);

    //Mongoose query for a single user based off the username passed to us by the login-modal form
    userModel.findOne({
        username: req.body.username,
    },
    (err,user) => 
    {
        if (err) console.log(err);

        else if (!user) console.log("No user found");
        //If a user is found, use bcrypt to compare the user entered password with the encrypted password in mongo
        else 
        {
            bcrypt.compare(req.body.password, user.password, (err, match) => 
            {   
                //If the password was INCORRECT
                if (err || match === null) res.redirect('/');
                //If the password was CORRECT                     
                if (match) 
                {
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
}

module.exports = {
    loginPost: function(req, res)
    {
        loginPost(req, res);
    }
}