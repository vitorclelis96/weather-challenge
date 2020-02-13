const axios = require('axios').default;
const SpotifyToken = require('../utils/SpotifyToken');
const spotToken = new SpotifyToken();


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

const getRandomTracks = async (playlists) => {
    try {
        const token = await spotToken.getToken();
        const randomPlaylistUrl = playlists[Math.floor(Math.random() * playlists.length)].tracks.href;
        const auth = {
            "Authorization": `Bearer ${token}`
        }
        const response = await axios.get(randomPlaylistUrl, {
            headers: auth
        })

        const tracks = []
        for (const item of response.data.items) {
            tracks.push(item.track.name);
        }

        return tracks;
    } catch (error) {
        if (error.response.status === 404) {
            throw new Error("Tracks not found")
        }
        throw error;
    }
}


const getPlaylist = async (genre) => {
    try {
        const token = await spotToken.getToken();
        const categoriePlaylists = `https://api.spotify.com/v1/browse/categories/${genre}/playlists?limit=20`;
        const auth = {
            "Authorization": `Bearer ${token}`
        }
        const response = await axios.get(categoriePlaylists, {
            headers: auth
        })
        return response.data.playlists.items;
    } catch (error) {
        if (error.response.status === 404) {
            throw new Error("Playlists not found")
        }
        throw error;
    }
}


const getCityWeatherByName = async (cityName) => {
    try {
        const queryUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.OPEN_WEATHER_KEY}&units=metric`;

        const response = await axios.get(queryUrl);
        
        return response.data.main.temp;
    } catch (error) {
        if (error.response.status === 404) {
            throw new Error("City not found")
        }
        throw error;
    }
}

const getCityWeatherByGeo = async (lat, lon) => {
    try {
        const queryUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_KEY}&units=metric`;

        const response = await axios.get(queryUrl);
        
        return response.data.main.temp;
    } catch (error) {
        if (error.response.status === 404) {
            throw new Error("City not found")
        }
        throw error;
    }
}



const getMusicList = async (req, res, next) => {
    try {
        const cityName = req.query.city;
        const cityLat = req.query.lat;
        const cityLon = req.query.lon;

        let cityTemperature;
        if (cityName) {
            cityTemperature = await getCityWeatherByName(req.query.city);
        } else if (cityLat && cityLon) {
            cityTemperature = await getCityWeatherByGeo(cityLat, cityLon);
        } else {
            return res.status(422).json({
                error: "You should provide either a city name or the city lat and lon"
            })
        }

        const genre = getGenreBasedOnTemperature(cityTemperature)
        const playlists = await getPlaylist(genre);
        
        const randomTracks = await getRandomTracks(playlists);
        
        return res.json({
            temperatur: cityTemperature,
            genre: genre,
            tracks: randomTracks
        });
    } catch (error) {
        return next(error);
    }
}





module.exports = getMusicList;