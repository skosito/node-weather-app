const request = require('request');
const apiConfig = require('../apiKeys');

const getWeather = (latitude, longitude, callback) => {
    request({
        url: `https://api.darksky.net/forecast/${apiConfig.darkSkyApiKey}/${latitude},${longitude}`,
        json: true
    }, (error, response, body) => {
        if(!error && response.statusCode === 200) {
            callback(undefined, {
                temperature: body.currently.temperature,
                apparentTemperature: body.currently.apparentTemperature
            });
        } else {
            callback('Unable to fetch weather.');
        }
    });
}

module.exports.getWeather = getWeather;
