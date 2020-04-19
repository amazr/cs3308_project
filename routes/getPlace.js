const helpers = require('./helpers');
const request = require('request');

function getPlaceGet(req, res)
{
    //Generate new response and create a openweather api url
    let response = helpers.createNewResponse(req.session.cards);
    let urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.newPlace}&appid=${process.env.OPENWEATHER}`

    request(urlWeather, (error, resp, body) => 
    {
        //If the call with the above url was successful
        if (!error && resp.statusCode == 200) 
        { 
            //The variables below are set to the required data we got from calling openweather
            let weatherJSON = JSON.parse(body);
            let origin = "Boulder";     //This is a placeholder, eventually get from req.session! (or maybe a slider)
            let destination = weatherJSON.name;
            let imageSource = helpers.getWeatherImage(weatherJSON.weather[0].main);

            //Create the url for calling googles direction API
            let urlGoogle = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE}`;

            request(urlGoogle, (error, response, body) => 
            {
                //If the call to Google directions was successfull
                if (!error && response.statusCode == 200) 
                {
                    //The variables below are set to the required data we got from calling Google Directions
                    let googleJSON = JSON.parse(body);
                    let name = googleJSON.destination_addresses[0];
                    let timeTo = `From ${googleJSON.origin_addresses[0]}: ${googleJSON.rows[0].elements[0].duration.text}`; //A bug with undefined travel times!

                    //Stores the card data in the users session
                    req.session.cards.push({
                        title: name,
                        currentTemp: helpers.KtoF(weatherJSON.main.temp),
                        conditions: weatherJSON.weather[0].main,
                        imageSource: imageSource,
                        timeTo: timeTo
                    });

                    res.redirect('/');
                }
                //If Google API could not find a route time (there is probably a bug with this where is logs the user out by not sending ejs the correct session information)
                //Can probably fix this by either redirecting or copying the solution from openweather failure below
                else 
                {                                      
                    response.messages.push("invdirection");
                    res.render('pages/index', response);
                }
            });
        }
        //If openweather could not find the location a user entered
        else 
        {
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