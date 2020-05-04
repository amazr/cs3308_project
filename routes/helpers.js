//This function creates a new response for EJS
//This should always be called to generate a response template if you are passing data to the frontend
function createNewResponse(session) {
    return {
        isLoggedIn: !!session.user,
        username: (session.user) ? session.user.name : "",
        page: "",
        tempType:session.tempType?session.tempType:'℉',
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

//From C to F
function CtoF(C){
    return C*1.8+32
}

//From F to C
function FtoC(F){
    return (F-32)/1.8
}

//Takes a condition code and returns an internal url for the correct weather condition
function getWeatherImage(condition, id) {

    if (condition === "01d")
    {
        return "img/icons/sunny.png";
    }
    else if (condition === "02d")
    {
        return "img/icons/partly_cloudy.png";
    }
    else if (condition === "03d" || condition === "03n")
    {
        return "img/icons/cloudy.png";
    }
    else if (condition === "04d" || condition === "04n")
    {
        return "img/icons/heavy_clouds.png";
    }
    else if ( condition === "09d" || condition === "09n")
    {
        return "img/icons/rain2.png";
    }
    else if (condition === "10d")
    {
        return "img/icons/rain.png";
    }
    else if (condition === "11d")
    {
      if (id >= 210 && id < 230)
      {
        return "img/icons/lightning.png";
      }
      else
      {
        return "img/icons/storm.png";
      }
    }
    else if (condition === "13d" || condition === "13n")
    {
        return "img/icons/snow.png";
    }
    else if (condition === "50d" || condition === "50n")
    {
      if (id == 781)
      {
        return "img/icons/tornado.png";
      }
      else
      {
        return "img/icons/fog.png";
      }
    }
    else if (condition === "01n")
    {
        return "img/icons/night.png";
    }
    else if (condition === "02n")
    {
        return "img/icons/partly_cloudy_n.png";
    }
    else if (condition === "10n")
    {
        return "img/icons/rain_night.png";
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
    CtoF:function(c){
        return CtoF(c);
    },
    FtoC:function(f){
        return FtoC(f);
    },
    getWeatherImage: function(condition, id)
    {
        return getWeatherImage(condition, id);
    }
}
