const axios = require('axios').default;
const qs = require('querystring');



// DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED



const spotifyAuth = async () => {
    try {
        const encodedData = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

        const authOptions = {
            url: "https://accounts.spotify.com/api/token",
            headers: {
                // "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${encodedData}`
            },
            form: {
                grant_type: "client_credentials"
            },
            json: true
        }

        const response = await axios.post(authOptions.url, qs.stringify(authOptions.form), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${encodedData}`
            } 
        })
        console.log(response.data);
    } catch (error) {
        console.log(error.response);
    }   
}


module.exports = spotifyAuth;