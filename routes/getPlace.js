const helpers = require('./helpers');
const request = require('request');
const apiCaller = require('./apiCalls');


async function getPlaceGet(req, res)
{
    try
    {
        let newCard = await apiCaller.getAllCardData(req.body.newPlace, req);
        
        // mock
        // let newCard = {
        //     title: 'Boulder',
        //     currentTemp: '12.3',
        //     minTemp: '13.3',
        //     maxTemp: '14.3',
        //     conditions: 'Cloudy',
        //     imageSource: '/img/ow_icons/clouds.png',
        //     timeTo: '2019/1/12 12:34:46',
        //     origin: 'New York'
        // }

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