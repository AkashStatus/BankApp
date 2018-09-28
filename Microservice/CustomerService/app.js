var express = require('express')
var app = express()
var dbHandler = require('./handlers/dbHandler')
var mongoConfig = require('./config/constants')

dbHandler.connect(mongoConfig.mongodb, (err) => {
    if (err) {
      console.log("Error in connecting to Database:"+ err)
      process.exit(1);
    } else {
      console.log('Connected to the Database...');
    }
  });

var listener = app.listen(8080,()=>{
   console.log("App is running on port: "+listener.address().port)
})