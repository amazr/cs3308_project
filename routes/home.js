const helpers = require('./helpers');

function homeGet(req, res)
{
    if (!req.session.cards)
    {
        req.session.cards = [];
    }

    let response = helpers.createNewResponse(req.session.cards);

    //If the user is logged in set the response accordingly
    if (req.session.user) 
    {
        response.isLoggedIn = req.session.user.isLoggedIn;
        response.username = req.session.user.name;
        response.lists = req.session.user.lists;
    }

    //Note: if the user is not logged in, the response is the default response from calling helpers.createNewResponse()
    res.render('pages/index', response);
}

module.exports = {
    homeGet: function(req, res)
    {
        homeGet(req,res);
    }
}