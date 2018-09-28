var mongoose =require('mongoose')
var mongodb = require('mongodb')


var loginStatusSchema = new mongoose.Schema({
	user_id: { type: String },           /** Reference to ObjectId of User Model */
    login_on: { type: Date},

}, {
	timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' },
	collection: "login-status"
});

module.exports = mongoose.model('loginStatusModel', loginStatusSchema);