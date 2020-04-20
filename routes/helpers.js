//This function creates a new response for EJS
//This should always be called to generate a response template if you are passing data to the frontend
function createNewResponse(session) {
    return {
        isLoggedIn: false,
        username: "",
        page: "",
        messages: [],
        cards: isListValid(session.cards),
        lists: [],
        location: isValidLocation(session.origin)
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

//The goal of this function is to serve an image url for the weather cards
function getWeatherImage(condition) {
    if (condition === "Clouds" || condition === "Mist" || condition === "Haze") 
    {
        return "img/cloudy.png";
    }
    else if (condition === "Snow") 
    {
        return "img/snow.png";
    }
    else if (condition === "Clear") 
    {
        return "img/sunny.png";
    }
    else if (condition === "Rain") 
    {
        return "img/rainy.png";
    }
    else if (condition === "Thunderstorm")
    {
        return "img/thunderstorm.png";
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