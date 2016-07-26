var config = {
    "google": {
        "maps": {
            "api_key": "API_KEY_HERE"           // Google Maps API Key
        }
    },
    "slack": {
        "bot_name": "BotNameHere",              // bot's name
        "channel": "@CHANNEL_NAME_HERE",        // can use your own name as a test channel
        "host": "HOST_HERE",                    // usually https://hooks.slack.com
        "path": "PATH_HERE",                    // ex: /services/ABC123/DEF456/g78hi90j1kl2345mno67pqr8
        "port": 0                               // usually 443
    }
};

module.exports = config;
