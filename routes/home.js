const helpers = require('./helpers');

function homeGet(req, res)
{
    //These are session field initializers.
    if (!req.session.cards)
    {
        req.session.cards = [];
    }
    if (!req.session.messages)
    {
        req.session.messages = [];
    }

    let response = helpers.createNewResponse(req.session);
    req.session.messages = [];

    //Note: if the user is not logged in, the response is the default response from calling helpers.createNewResponse()
    res.render('pages/index', response);
}

module.exports = {
    homeGet: function(req, res)
    {
        homeGet(req,res);
    }
}