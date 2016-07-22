const https = require('https');
const config = require('../config/config');

getDistanceMatrixData("1616 Da Vinci Ct, Davis, CA", "1 Shields Wy, Davis, CA");

function getDistanceMatrixData(origin, destination) {
    var api_url, data;

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

            var postOptions = {
                hostname: config.slack.host,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                port: config.slack.port,
                path: config.slack.path,
                method: "POST",
                payload: {
                    "channel": config.slack.channel,
                    "fallback": encodeURI(api_url),
                    "text": encodeURI(output)
                }
            };

            var req = https.request(JSON.stringify(postOptions), (res) => {
                res.on("data", (d) => {
                    console.log('Slack Data Success!');
                    process.stdout.write(d);
                }).on("error", (e) => {
                    console.log('Slack Error: ', e);
                }).on("uncaughtException", (e) => {
                    console.log('Slack Exception: ', e);
                });
            });

            req.end();
        });

        console.log('attempted request');
        return;

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
