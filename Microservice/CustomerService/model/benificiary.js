var mongoose =require('mongoose')
var mongodb = require('mongodb')


var beneficiaryUserSchema = new mongoose.Schema({
    user_id:  {type: String, required: true},
    beneficiary_user_id: {type: String,required: true},
	first_name: String,
    beneficiary_account_no: {type: Number, required: true},
    account_type: {type: String}

}, {
	timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' },
	collection: "beneficiary-users"
});

module.exports = mongoose.model('beneficiaryUserModel', beneficiaryUserSchema);