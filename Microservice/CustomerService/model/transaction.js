var mongoose =require('mongoose')
var mongodb = require('mongodb')


var transactionSchema = new mongoose.Schema({
    user_id: String,
    deposited_amount: Number,
    withdrawal_amount: Number,
    is_deposited: {type: Boolean ,default: false},
    is_withdrawal: {type: Boolean, default: false}
}, {
	timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' },
	collection: "transactions"
});

module.exports = mongoose.model('transactionModel', transactionSchema);