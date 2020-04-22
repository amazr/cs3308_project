const helpers = require('./helpers');

function cardGet(req, res)
{

    let response = helpers.createNewResponse(req.session);
    req.session.messages = [];

    //Note: if the user is not logged in, the response is the default response from calling helpers.createNewResponse()
    res.render('partials/weatherCard', response);
}

module.exports = {
    cardGet: function(req, res)
    {
        cardGet(req,res);
    }
}