const https = require('https');
const config = require('../config/config');
var Slack = require('slack-node');

getDistanceMatrixData("1616 Da Vinci Ct, Davis, CA", "1 Shields Wy, Davis, CA");

function getDistanceMatrixData(origin, destination) {
    var api_url, data, slack = new Slack();

    origin = encodeURI(origin);
    destination = encodeURI(destination);

    api_url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + origin + "&destinations=" + destination + "&key=" + config.google.maps.api_key;

    https.get(api_url, (res) => {
        res.on("data", (d) => {
            var tempData = JSON.parse(d),
                data = tempData.rows[0].elements[0];

            var origin_address = tempData.origin_addresses[0],
                destination_address = tempData.destination_addresses[0],
                distance = data.distance.text,
                duration = data.duration.text,
                output = "Your trip from " + origin_address + " to " + destination_address + ", covering " + distance + " should take " + duration + "!";

            slack.setWebhook(config.slack.host + config.slack.path);
            slack.webhook({
                channel: config.slack.channel,
                username: config.slack.bot_name,
                text: output
            }, function (err, response) {
                console.log(err);
                console.log(response);
            });

        });

        res.on("error", (e) => {
            console.log('Google Error: ', e);
        }).on("uncaughtException", (e) => {
            console.log('Google Exception: ', e);
        });

    }).on("error", (e) => {
            console.log('HTTPS Error: ', e);
    }).on("uncaughtException", (e) => {
            console.log('HTTPS Exception: ', e);
    });
}
