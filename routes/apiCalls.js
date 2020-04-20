const request = require('request');
const helpers = require('./helpers');

//This function returns a promise. A promise just guarentees that there will be a value there. If this function executes "correctly"
// then we return the data in 'resolve', if there was an error then we return the error in 'reject'. Technically, this function isn't
// sync, but we can treat it as a blocking function in an async function but calling it with the 'await' keyword. Which we do above.
function getAllCardData(location, req)
{
    return new Promise((resolve, reject) => 
    {
        let urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER}`

        request(urlWeather, (error, resp, body) => 
        {
            if (!error && resp.statusCode == 200) 
            { 
                //The variables below are set to the required data we got from calling openweather
                let weatherJSON = JSON.parse(body);

                let origin = "";
                if (!req.session.origin)
                {
                    origin = "Boulder";
                }
                else 
                {
                    origin = req.session.origin;
                }

                let destination = weatherJSON.name;
                let imageSource = helpers.getWeatherImage(weatherJSON.weather[0].main);
                
                //Create the url for calling googles direction API
                let urlGoogle = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE}`;
                
                request(urlGoogle, (error, respond, body) => 
                {
                    //If the call to Google directions was successfull
                    if (!error && respond.statusCode == 200) 
                    {
                        //The variables below are set to the required data we got from calling Google Directions
                        let googleJSON = JSON.parse(body);
                        let name = googleJSON.destination_addresses[0];

                        let timeTo = "";
                        try 
                        {
                            timeTo = `From ${googleJSON.origin_addresses[0]}: ${googleJSON.rows[0].elements[0].duration.text}`;
                        }
                        catch (error)
                        {
                            timeTo = "No time found";
                        }
                                    
                        //This can be thought of as returning the following object
                        resolve({
                            title: name,
                            currentTemp: helpers.KtoF(weatherJSON.main.temp),
                            conditions: weatherJSON.weather[0].main,
                            imageSource: imageSource,
                            timeTo: timeTo
                        });          
                    }
                    else
                    {
                        reject(error);
                    }
                });
            }
            else
            {
                reject(error);
            }
        });
    });
}

function callOpenWeather()
{   
    //This function should specifically call open weather and return some sort of data
}

function callGoogleDirections(origin, destination)
{
    //This function should specifically call google directions api and return the travel time
    //The hope here is that we can add a way to change the origin on each individual card
    return new Promise((resolve, reject) =>
    {
        let urlGoogle = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE}`;
                    
        request(urlGoogle, (error, respond, body) => 
        {
            //If the call to Google directions was successfull
            if (!error && respond.statusCode == 200) 
            {
                //The variables below are set to the required data we got from calling Google Directions
                let googleJSON = JSON.parse(body);

                let destinationName = googleJSON.destination_addresses[0];
                let originName = googleJSON.origin_addresses[0];

                if (!destinationName || !originName)
                {
                    destinationName = "";
                    originName = "";
                }

                let timeTo = "";
                try 
                {
                    timeTo = `From ${googleJSON.origin_addresses[0]}: ${googleJSON.rows[0].elements[0].duration.text}`;
                }
                catch (error)
                {
                    timeTo = "No time found";
                }
                                        
                //This can be thought of as returning the following object
                resolve({
                    originName: originName,
                    destinationName: destinationName,
                    time: timeTo
                });          
            }
            else
            {
                reject(error);
            }
        });
    });
}

module.exports = {
    getAllCardData: function(location, req)
    {
        return getAllCardData(location, req);
    },
    callOpenWeather: function()
    {
        callOpenWeather();
    },
    callGoogleDirections: function(origin, destination)
    {
        return callGoogleDirections(origin, destination);
    }
}