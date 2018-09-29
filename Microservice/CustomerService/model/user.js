var mongoose =require('mongoose')
var mongodb = require('mongodb')

var userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: String,
    unique_user_id: {type: String, required: true},
    email:  String,
    mobile_no:  Number,
	password: {type: String, required: true}
}, {
	timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' },
	collection: "users"
});

module.exports = mongoose.model('userModel', userSchema);