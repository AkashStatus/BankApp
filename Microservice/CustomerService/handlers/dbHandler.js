var mongodb = require('mongodb'),
mongoose = require('mongoose'),
database;

function connect(dbconfig,callback) {
    var connectionString = getConnectionInfo(dbconfig);
    var db = mongoose.connection;
    db.once('connecting', function() {
        console.log('connecting to MongoDB... at '+ connectionString)
    }); 
    db.on('error', function(error) {
    console.log('Error in MongoDb connection: ' + error)
      mongoose.disconnect();
    });
    db.on('connected', function() {
      console.log('MongoDB connected!')
    });
    db.on('reconnected', function () {
      console.log('MongoDB reconnected!')
    });
    db.on('disconnected', function() {
        console.log('MongoDB disconnected! ')
    });
    database = mongoose.connect(connectionString, dbconfig.options,callback);
}

function getConnectionInfo(dbconfig) {

    var standardURI = 'mongodb://';
        standardURI = standardURI.concat(
            dbconfig.user,
            ':',
            dbconfig.password,
            '@',
            dbconfig.host,
            ':',
            dbconfig.port,
            '/',
            dbconfig.name
        );

    return standardURI;
}

module.exports = {
    connect
};
