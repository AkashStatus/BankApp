var mongoose =require('mongoose')
var mongodb = require('mongodb')

var accountSchema = new mongoose.Schema({
    user_id : String,           /**  References to ObjectId of userModel */
    net_balance: {type: Number, default: 0},
    bank_address:  String,
    account_no: {type: Number, required: true},
    account_type:  String,
    branch_name: String

}, {
	timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' },
	collection: "accounts"
});

module.exports = mongoose.model('accountModel', accountSchema);