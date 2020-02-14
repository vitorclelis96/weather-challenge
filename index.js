const express = require('express');
require('dotenv').config();
// const spotifyAuth = require('./utils/spotify_auth');
const SpotifyToken = require('./utils/SpotifyToken');

const mainRoute = require('./routes/mainRoute');


const app = express();
app.use(express.json());

// Get an initial token right after server starts to listen
const spotifyToken = new SpotifyToken().init();


/*
    Example Route
    /v1/music?city=Contagem 
    /v1/music?lat=50&lon=50
*/
app.use("/v1", mainRoute);



app.use(async (req, res, next) => {
    try {
        return res.status(404).json({
            error: "Route not found"
        })
    } catch (error) {
        return next(error);
    }
});

app.use( (err, req, res, next) => {
    return res.status(500).json({
        message: err.message
    })
});





app.listen(process.env.PORT, () => {
    console.log("Listening...")
});