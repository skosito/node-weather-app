const yargs = require('yargs');
const axios = require('axios');
const apiConfig = require('./apiKeys');

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `https://maps.google.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiConfig.geocodeApiKey}`;

axios.get(geocodeUrl).then((response) => {
    if(response.data.status === 'ZERO_RESULTS') {
        throw new Error('Unable to find that address.');
    }

    var latitude = response.data.results[0].geometry.location.lat;
    var longitude = response.data.results[0].geometry.location.lng;

    var weatherUrl = `https://api.darksky.net/forecast/${apiConfig.darkSkyApiKey}/${latitude},${longitude}`;
    console.log(response.data.results[0].formatted_address);

    return axios.get(weatherUrl);
}).then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;

    console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`);
}).catch((e) => {
    if(e.code === 'ECONNREFUSED') {
        console.log('Unable to connect to API servers.')
    } else {
        console.log(e.message);
    }
});