//This function creates a new response for EJS
//This should always be called to generate a response template if you are passing data to the frontend
function createNewResponse(session) {
    return {
        isLoggedIn: !!session.user,     
        username: (session.user) ? session.user.name : "",
        page: "",
        messages: (session.messages) ? session.messages: [],
        cards: isListValid(session.cards),
        lists: (session.user) ? session.user.lists: [],
        location: isValidLocation(session.origin),
        embedKey: process.env.GOOGLEEMBED
    };
}

//From kelvin to F
function KtoF(tempK) {
    return Math.ceil(((tempK-273.15)*1.8)+32);
}

//From kelvin to C
function KtoC(tempK) {
    return K-273.15;
}

//Takes a condition code and returns an internal url for the correct weather icon
function getWeatherImage(condition) {
    /*
        01d = img/ow_icons/clearsky.png
        02d = img/ow_icons/fewclouds.png
        03d = img/ow_icons/clouds.png
        04d = img/ow_icons/brokenclouds.png
        09d = img/ow_icons/rainshowers.png
        10d = img/ow_icons/rain.png
        11d = img/ow_icons/thunderstorms.png
        13d = img/ow_icons/snow.png
        50d = img/ow_icons/mist.png
    */
    if (condition === "01d") 
    {
        return "img/ow_icons/clearsky.png";
    }
    else if (condition === "02d") 
    {
        return "img/ow_icons/fewclouds.png";
    }
    else if (condition === "03d" || condition === "03n") 
    {
        return "img/ow_icons/clouds.png";
    }
    else if (condition === "04d" || condition === "04n") 
    {
        return "img/ow_icons/brokenclouds.png";
    }
    else if (condition === "09d" || condition === "09n")
    {
        return "img/ow_icons/rainshowers.png";
    }
    else if (condition === "10d")
    {
        return "img/ow_icons/rain.png";
    }
    else if (condition === "11d")
    {
        return "img/ow_icons/thunderstorms.png";
    }
    else if (condition === "13d" || condition === "13n")
    {
        return "img/ow_icons/snow.png";
    }
    else if (condition === "50d" || condition === "50n")
    {
        return "img/ow_icons/mist.png";
    }
    else if (condition === "01n")
    {
        return "img/ow_icons/clearsky_night.png";
    }
    else if (condition === "02n")
    {
        return "img/ow_icons/fewclouds_night.png";
    }
    else if (condition === "10n")
    {
        return "img/ow_icons/rain_night.png";
    }
    else 
    {
        return "error.png";
    }
}

//This function checks if the argument is an initialized array and either returns the array or an initialized empty array
//This function is internal and used in createNewResponse
function isListValid(list)
{
    if (!list)
    {
        return [];
    }
    else
    {
        return list;
    }
}

function isValidLocation(location)
{
    if (!location)
    {
        return "Boulder";
    }
    else
    {
        return location;
    }
}

module.exports = {
    createNewResponse: function(req) 
    {
        return createNewResponse(req);
    },
    KtoF: function(tempK) 
    {
        return KtoF(tempK);
    },
    KtoC: function(tempK)
    {
        return KtoC(tempK);
    },
    getWeatherImage: function(condition)
    {
        return getWeatherImage(condition);
    }
}