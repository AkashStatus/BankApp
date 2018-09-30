var mongodb= {
    "host" : "ds117423.mlab.com",
    "port": "17423",
    "name": "bankdb",
    "user": "CognitiveScale",
    "password": "akash1234",
    "options": {
        "server":{
            "poolSize": 5,
            "auto_reconnect": true,
            "reconnectTries":360,
            "reconnectInterval": 10000
        }
    }
}

module.exports = {mongodb}