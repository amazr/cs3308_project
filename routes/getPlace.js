const helpers = require('./helpers');
const request = require('request');
const apiCaller = require('./apiCalls');


async function getPlaceGet(req, res)
{
    try
    {
        let newCard = await apiCaller.getAllCardData(req.body.newPlace, req);
        req.session.cards.push(newCard);
    }
    catch (error)
    {
        req.session.messages = [];
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