const userModel = require('../models/user');
const helpers = require('./helpers');

//This route is intended to search for a list and then load it into response cards
function getList(req, res)
{
    req.session.cards = [];
    let response = helpers.createNewResponse(req.session.cards);

    //This object should follow the listSchema defined in user.js
    //Maybe open up something and ask the user for a name?
    let listItem = { 
        name: "example", 
        locations: [] 
    };

    res.redirect('/');
}

module.exports = {
    getListGet: function(req, res)
    {
        getList(req, res);
    }
}