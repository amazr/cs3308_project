const helpers = require('./helpers');
const request = require('request');
const apiCaller = require('./apiCalls');


async function getPlaceGet(req, res)
{
    //Generate new response and create a openweather api url
    let response = helpers.createNewResponse(req.session);
    try
    {
        console.log(req.body)
        let newCard = await apiCaller.getAllCardData(req.body.newPlace, req);
        req.session.cards.push(newCard);
    }
    catch (error)
    {
        req.session.messages.push("invplace");
    }

    res.redirect('/')
}

module.exports = {
    getPlaceGet: function(req, res)
    {
        getPlaceGet(req, res);
    }
}