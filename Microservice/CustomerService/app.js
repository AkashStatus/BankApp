var express = require('express')
var app = express()
var dbHandler = require('./handlers/dbHandler')
var mongoConfig = require('./config/constants')
var bodyParser = require('body-parser')
app.use(bodyParser.json())
dbHandler.connect(mongoConfig.mongodb, (err,connection) => {
    if (err) {
      console.log("Error in connecting to Database:"+ err)
      process.exit(1);
    } else {
      console.log('Connected to the Database...');
    }
  });


app.use('/v1',require('./routes/user')) 
app.use('/v1',require('./routes/login'))
app.use('/v1',require('./routes/beneficiary'))
app.use('/v1',require('./routes/transaction'))
app.use('/v1',require('./routes/transfer-fund'))
var listener = app.listen(8080,()=>{
   console.log("App is running on port: "+listener.address().port)
})