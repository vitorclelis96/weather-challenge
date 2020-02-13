const axios = require('axios').default;


const getGenreBasedOnTemperature = (temp) => {
    if (temp > 30) {
        return "party"
    } if (temp <= 30 && temp >= 15) {
        return "pop"
    } if (temp < 15 && temp >= 10) {
        return "rock"
    } if (temp < 10) {
        return "classical"
    }
}


const getPlaylist = async (genre) => {
    try {
        const categoriePlaylists = `https://api.spotify.com/v1/browse/categories/${genre}/playlists`;
        const auth = {
            "Authorization": `Bearer ${process.env.SPOTIFY_KEY}`
        }
        const teste = await axios.get(categoriePlaylists, {
            headers: auth
        })

        console.log(teste);
        
    } catch (error) {
        if (error.response.status === 404) {
            throw new Error("City not found")
        }
        throw error;
    }
}


const queryCityByName = async (cityName) => {
    try {
        const queryUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.OPEN_WEATHER_KEY}&units=metric`;

        const response = await axios.get(queryUrl);
        
        return response.data;
    } catch (error) {
        if (error.response.status === 404) {
            throw new Error("City not found")
        }
        throw error;
    }
}



const getMusicList = async (req, res, next) => {
    try {
        // VALIDATE
        const cityName = req.query.city;
        const cityLat = req.query.lat;
        const cityLon = req.query.lon;

        let weatherRawData;
        if (cityName) {
            weatherRawData = await queryCityByName(req.query.city);
        } else if (cityLat && cityLon) {
            weatherRawData = await queryCityByGeo(req.query.city);
        } else {
            return res.status(422).json({
                error: "You should provida either a city name or the city lat and lon"
            })
        }

        // ACT

        // teste
        getPlaylist("rock");
        

    } catch (error) {
        return next(error);
    }
}





module.exports = getMusicList;