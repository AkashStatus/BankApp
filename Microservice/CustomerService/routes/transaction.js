var express = require('express')
var router = express.Router()
var UserModel = require('../model/user')
var transactionModel = require('../model/transaction')

router.post('/users/transactions',function(req,res){
   if(req.body.is_deposited){
     var transactionObject = {
        user_id: req.body.user_id,
        deposited_amount: req.body.deposited_amount,
        is_deposited: true
     }
     processTransaction(transactionObject,function(err,result){
        if(err){
            res.status(500).send('Internal Server Error'+err)
        }
        else{
            res.status(200).send(result)
        }
     })
  }
  else if(req.body.is_withdrawal){
        var transactionObject = {
           user_id: req.body.user_id,
           withdrawal_amount: req.body.withdrawal_amount,
           is_withdrawal: true
        }
        processTransaction(transactionObject,function(err,result){
            if(err){
                res.status(err.status).send(err.message)
            }
            else{
                res.status(200).send(result)
            }
        })
    }
    else 
    {
        console.log('Transaction cant be')
        res.status(400).send('Please provide at least one of is_withdrawal and is_deposited')
    }
})
function processTransaction(transactionObject,callback){
    transactionModel(transactionObject).save((err,result)=>{
        if(err){
           console.log('Error in saving transaction')
           return callback({
            status: 500,
            message: 'Internal Server Error'
        })
        }
        else{
            console.log('Transaction Saved in DB')
           UserModel.findOne({_id: transactionObject.user_id},function(err,user){
               if(err){
                console.log('Error Occurred');
                return callback({
                    status: 500,
                    message: 'Internal Server Error'
                })
               }
               else if(user){
                   user= JSON.parse(JSON.stringify(user));
                   if(transactionObject.is_deposited){
                    user.net_balance = user.net_balance + transactionObject.deposited_amount
                   }
                   else{
                    user.net_balance = user.net_balance - transactionObject.withdrawal_amount
                   }
                   UserModel.update({_id: transactionObject.user_id},user,function(err,result){
                        if(err){
                            console.log('Cant update user net balance')
                            return callback({
                                status: 500,
                                message: 'Internal Server Error'
                            })
                        }
                        else{
                            console.log('User net_balance is updated. Transaction successfull')
                            return callback(null,'success')
                        }
                   })
                }
                else{
                    console.log('No user found for user id',transactionObject.user_id)
                    return callback({
                        status: 404,
                        message: 'No user found'
                    })
                }
           })
        }
    })
}


router.get('/users/:userId/transactions',function(req,res){
    transactionModel.find({user_id: req.params.userId},{ _id: 0 , user_id: 0},function(err,transactionList){
       if(err){
           console.log('Error Occurred');
           res.status(500).send('Internal Server Error'+err)
       }
       else if(transactionList){
          console.log('Transactions List found')
          res.status(200).send(transactionList);
       }
       else{
           res.status(404).send('No transaction was found for userId',req.params.userId)
       }
   })
})

router.get('/users/:userId/transactions/:transactionId',function(req,res){
    transactionModel.findOne({_id: req.params.transactionId},{ _id: 0 , user_id: 0},function(err,transaction){
       if(err){
           console.log('Error Occurred');
           res.status(500).send('Internal Server Error'+err)
       }
       else if(transaction){
          console.log('Transaction found')
          res.status(200).send(transaction);
       }
       else{
           res.status(404).send('No transaction was found for transactionId',req.params.transactionId)
       }
   })
})
module.exports = router;