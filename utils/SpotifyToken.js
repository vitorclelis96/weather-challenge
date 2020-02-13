const axios = require('axios').default;
const qs = require('querystring');





// TODO: Clean async errors;

class SpotifySingleToken {
    constructor() {
        if (!SpotifySingleToken.instance) {
            SpotifySingleToken.instance = this;
        }
        return SpotifySingleToken.instance;
    }

    async init() {
        this.token = await this._generateNewToken();
        this.tokenDate = new Date(Date.now());
    }

    _getSecondsBetween(dateOne, dateTwo) {
        return ( (dateOne - dateTwo) / 1000);
    }

    async _generateNewToken() {
        try {
            const encodedData = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
    
            const authOptions = {
                url: "https://accounts.spotify.com/api/token",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${encodedData}`
                },
                data: {
                    grant_type: "client_credentials"
                }
            }
    
            const response = await axios.post(authOptions.url, qs.stringify(authOptions.data), {
                headers: authOptions.headers
            })
    
            return response.data.access_token;
        } catch (error) {
            // TODO : Clean errors
            console.log(error.response);
        }   
    }

    async getToken() {
        try {
            const currentTime = new Date(Date.now()).getTime();
            if (this._getSecondsBetween(currentTime, this.tokenDate.getTime()) >= 3540) {
                await this.init();
            }
            return this.token;
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = SpotifySingleToken;