const helpers = require('./helpers');
const request = require('request');

function getPlaceGet(req, res)
{
    let response = helpers.createNewResponse(req.session.cards);
    let urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.newPlace}&appid=${process.env.OPENWEATHER}`
    request(urlWeather, (error, resp, body) => {
        if (!error && resp.statusCode == 200) { //On success
            let weatherJSON = JSON.parse(body);
            let origin = "Boulder";     //This is a placeholder, eventually get from req.session! (or maybe a slider)
            let destination = weatherJSON.name;
            let imageSource = helpers.getWeatherImage(weatherJSON.weather[0].main);
            let urlGoogle = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE}`;
            request(urlGoogle, (error, response, body) => {
                if (!error && response.statusCode == 200) { //On Success
                    let googleJSON = JSON.parse(body);
                    let name = googleJSON.destination_addresses[0];
                    let timeTo = `From ${googleJSON.origin_addresses[0]}: ${googleJSON.rows[0].elements[0].duration.text}`; //A bug with undefined travel times!

                    req.session.cards.push({
                        title: name,
                        currentTemp: helpers.KtoF(weatherJSON.main.temp),
                        conditions: weatherJSON.weather[0].main,
                        imageSource: imageSource,
                        timeTo: timeTo
                    });

                    res.redirect('/');
                }
                else {                                      //If no route found
                    response.messages.push("invdirection");
                    res.render('pages/index', response);
                }
            });
        }
        else {      //IF A PLACE WAS INVALID
            response.messages.push("invplace");
            if (req.session.user) 
            {
                response.isLoggedIn = req.session.user.isLoggedIn;
                response.username = req.session.user.name;
                response.lists = req.session.user.lists;
            }
            res.render('pages/index', response);
        }
    });
}

module.exports = {
    getPlaceGet: function(req, res)
    {
        getPlaceGet(req, res);
    }
}