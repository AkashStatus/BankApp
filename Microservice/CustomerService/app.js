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
      var listener = app.listen(9000,()=>{
        console.log("App is running on port: "+listener.address().port)
     })
    }
  });

app.get('/',function(req,res){
    res.status(200).send("Bank App is Running")
 })
app.use('/v1',require('./routes/user')) 
app.use('/v1',require('./routes/login'))
app.use('/v1',require('./routes/beneficiary'))
app.use('/v1',require('./routes/transaction'))
app.use('/v1',require('./routes/transfer-fund'))