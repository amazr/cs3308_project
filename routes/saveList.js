const userModel = require('../models/user');
const helpers = require('./helpers');

function saveList(req, res)
{
    let response = helpers.createNewResponse(req.session.cards);

    //This object should follow the listSchema defined in user.js
    //Maybe open up something and ask the user for a name?
    let listItem = { 
        name: req.body.listName, 
        locations: [] 
    };

    if (!req.session.cards)
    {
        res.redirect('/');
    }

    //Make sure the user has some cards and then find the user and update the database with the new list
    if (req.session.cards.length >= 1)
    {
        for (let i = 0; i < req.session.cards.length; i++) 
        {
            listItem.locations.push(req.session.cards[i].title);
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
}

module.exports = {
    saveListGet: function(req, res)
    {
        saveList(req, res);
    }
}