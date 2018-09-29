var mongoose =require('mongoose')
var mongodb = require('mongodb')


var transferFundSchema = new mongoose.Schema({
    from_user_id:  {type: String, required: true},
    to_user_id: {type: String, required: true},
    from_account: {type: String, required: true},
    to_account: {type: String, required: true},
    transferred_amount: Number,
}, {
	timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' },
	collection: "fund-transfers"
});

module.exports = mongoose.model('transferFundModel', transferFundSchema);