const userModel = require('../models/user');
const helpers = require('./helpers');
const apiCaller = require('./apiCalls');


//This route is intended to search for a list and then load it into response cards
//IT IS NOT FINISHED
function getList(req, res)
{
    req.session.cards = [];

    //Search the database for the current logged in user
    userModel.findOne(
        {
            username: req.session.user.name
        }, 
        //Make this function specifcally async so that we can block it using await when we want to call openweather and google api later on
        async function(error, user)
        {
            if(error)
            {
                console.log("No user found");
            }
            //Found a user
            else
            {
                listToLoad = [];
                //Iterate through the users list and find the list with the specified name
                for (let i = 0; i < user.lists.length; i++)
                {
                    //If the users has a list with the specified name
                    if (user.lists[i].name == req.params.name)
                    {
                        listToLoad = user.lists[i];
                        break;
                    }
                }

                //Iterate through all of the locations in the users list
                for (let i = 0; i < listToLoad.locations.length; i++)
                {
                    //This following is making node (which is normally async) sync. Essentially, we need to call request a bunch of times
                    // and it is important that request finishes calling before we move onto the next step in our code. So we will tell node
                    // to wait for some return value from the following function before continuing. This ensures us that we have actual data 
                    // to add to our users card list before we end up actually sending that data over.
                    try
                    {
                        let newCard = await apiCaller.getAllCardData(listToLoad.locations[i], req);
                        req.session.cards.push(newCard);
                    }
                    catch (error)
                    {
                        console.log("Something went wrong...\n" + error);
                    }
                }
            }
            //console.log(response);
            //res.render('pages/index', response);
            res.redirect('/');
        }
    );
}

module.exports = {
    getListGet: function(req, res)
    {
        getList(req, res);
    }
}