var mongoose =require('mongoose')
var mongodb = require('mongodb')
var expressJoi = require('express-joi-validator')

var userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    unique_user_id: {type: String, required: true},
	last_name: String,
    email:  String,
    registered_mobile_no:  Number,
    net_balance: {type: Number, default: 0},
	password: {type: String, required: true},
    address:  String,
    account_no: {type: Number, required: true},
    account_type:  String,
    branch_name: String

}, {
	timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' },
	collection: "users"
});

module.exports = mongoose.model('userModel', userSchema);