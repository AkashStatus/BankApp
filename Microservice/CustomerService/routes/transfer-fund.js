var express = require('express')
var router = express.Router()
var async = require('async')
var accountModel = require('../model/account')
var transactionModel = require('../model/transaction')
var transferFundModel = require('../model/transfer-fund')
router.post('/users/accounts/fund/transfer',function(req,res){
   if(!req.body.from_user_id){
    console.log("Request Body should contain from_account");
    res.status(400).send("Request Body should contain from_account")
   }
   else if(!req.body.to_user_id){
    console.log("Request Body should contain from_account");
    res.status(400).send("Request Body should contain from_account")
   }
   else if(!req.body.transferred_amount){
    console.log("Request Body should contain from_account");
    res.status(400).send("Request Body should contain from_account")
   }
   else {
       var fundTransferObject = null;
      async.waterfall([
          (callback)=>{
            transferFundModel(req.body).save((err,result)=>{
                if(err){
                    console.log('error while saving in fund-transfer model'+err)
                    callback({status : 500,
                        message: 'Internal Server Error'
                     })
                 }
                 else{
                    fundTransferObject=result;
                    accountModel.findOne({user_id: req.body.from_user_id},function(err,account){
                        if(err){
                            callback({status : 500,
                            message: 'Internal Server Error'
                            })
                          }
                          else if(account){
                            account= JSON.parse(JSON.stringify(account));
                            if( account.net_balance >= req.body.transferred_amount){
                                account.net_balance = account.net_balance - req.body.transferred_amount
                                accountModel.updateOne({user_id: req.body.from_user_id},account,function(err,result){
                                    if(err){
                                        callback({status : 500,
                                            message: 'Internal Server Error'
                                        })
                                    }
                                    else{
                                        console.log('amount is deducted from user account')
                                        callback(null ,'success')
                                    }
                                })
                            } 
                            else{
                                callback({status: 400,
                                message: 'you dont have sufficient amount to transfer'})
                            }
                          }
                         else{
                             console.log('No account is associated with from_user_id')
                             callback({status : 400,
                                message: 'No account is associated with from_user_id'
                                })
                            }
                        })  
                  }
             }) 
          },
          (success,callback )=>{
              var transactionObject ={
                  is_transferred : true, 
                  user_id: req.body.from_user_id,
                  is_paid: true,
                  transferred_amount :req.body.transferred_amount
                    }
            transactionModel(transactionObject).save((err,transaction)=>{
                if(err){
                    console.log('Error in saving transaction')
                    rollBackTransaction(req,'fail_transaction_on_withdrawal',null,null,function(err){
                            callback(err)
                    })
                }
                else{
                    console.log('Transaction saved in DB')
                    callback(null,transaction)
                }
            })
          },
          (transaction,callback)=>{
            accountModel.findOne({user_id: req.body.to_user_id},function(err,account){
                if(err){
                    callback({status : 500,
                    message: 'Internal Server Error'
                    })
                  }
                  else if(account){
                    account= JSON.parse(JSON.stringify(account));
                    account.net_balance = account.net_balance + req.body.transferred_amount
                    accountModel.updateOne({user_id: req.body.to_user_id},account,function(err,result){
                        if(err){
                            rollBackTransaction(req,'fail_transfer_on_deposit',transaction._id,null,function(err){
                                 callback(err)
                            })
                        }
                        else{
                            console.log('amount is transferred to user account')
                            callback(null ,transaction)
                        }
                    })
                  }
                 else{
                     console.log('No account is associated with from_user_id')
                     callback({status : 400,
                        message: 'No account is associated with from_user_id'
                        })
                    }
                })
          },
          (oldTransaction, callback)=>{
            var transactionObject ={
                is_transferred: true, 
                user_id: req.body.to_user_id,
                is_received: true,
                transferred_amount :req.body.transferred_amount
                  }
          transactionModel(transactionObject).save((err,transaction)=>{
              if(err){
                  console.log('Error in saving transaction')
                  rollBackTransaction(req,'fail_transaction_on_deposit',oldTransaction._id,transaction._id,function(err){
                          callback(err)
                  })
              }
              else{
                  console.log('Transaction saved in DB')
                  callback(null,transaction)
              }
          })
          }
      ],(error,transaction)=>{
          if(error){
              console.log("Error in amount transfer")
              transferFundModel.remove({_id: fundTransferObject._id},(err,result)=>{
                if(err){
                    console.log('Error Occured while deleting fundTransferObject')
                    res.status(500).send('Internal Server Error')
                }
                else{
                    res.status(error.status).send(error.message)
                }
              })
             
          }
          else{
              res.status(200).send('Amount Transferred Successfully')
          }
      })
   }
})

function rollBackTransaction(req,rollbackType, transactionId,newTransactionId,callback){
    if(rollbackType === 'fail_transaction_on_withdrawal'){
        findAndUpdateUser(req.body.from_user_id,null,function(err,something){
                 callback(err)
        })
      }          
    if(rollbackType === 'fail_transfer_on_deposit'){
                findAndUpdateUser(req.body.from_user_id,null,function(err,something){
                    if(err){
                        callback(err)
                    }
                    else{
                        console.log('amount is rolled back to user account')
                        transactionModel.remove({_id: transactionId},function(err,res){
                        if(err){
                            console.log('Error occurred while updating' +err)
                                callback({status : 500,
                                message: 'Transaction not removed from DB.Internal Server Error'
                            })
                        }
                        else{
                            console.log('Error occurred while updating' +err)
                                callback({status : 500,
                                message: 'Transaction removed from DB'
                            })
                        }
                    })
            }
     })
   }
   if(rollbackType === 'fail_transaction_on_deposit'){
    findAndUpdateUser(req.body.from_user_id,null,function(err,something){
         if(err){
            callback(err)
         }
         else{
            console.log('amount is rolled back to user account')
            transactionModel.remove({_id: transactionId},function(err,res){
                if(err){
                    console.log('Error occurred while updating' +err)
                        callback({status : 500,
                        message: 'Transaction not removed from DB.Internal Server Error'
                    })
                }
                else{
                    findAndUpdateUser(req.body.from_user_id,'deductAmountFromLastUser',function(err,something){
                        if(err){
                            callback(err)
                        }
                    })
                    console.log('amount is rolled back to user account')
                    transactionModel.remove({_id: newTransactionId},function(err,res){
                        if(err){
                            console.log('Error occurred while updating' +err)
                                callback({status : 500,
                                message: 'Transaction not removed from DB.Internal Server Error'
                            })
                        }
                        else {
                            callback({status : 500,
                                message: 'Transaction removed from DB'
                        })
                    }
                })            
            }
         })
        }
    })
 }
}

function findAndUpdateUser(userId,deductAmountFromLastUser,callback){
    accountModel.findOne({user_id: userId},function(err,account){
        if(err){
           console.log('Internal Server Error' +err)
           callback({status : 500,
                   message: 'Internal Server Error'
                })
            }
          else if(account){
            account= JSON.parse(JSON.stringify(account));
            if(deductAmountFromLastUser!=null){
                account.net_balance = account.net_balance - req.body.transferred_amount
            }
            else{
                account.net_balance = account.net_balance + req.body.transferred_amount
            }
            accountModel.updateOne({user_id: userId},account,function(err,result){
                if(err){
                    console.log('Error occurred while updating' +err)
                    callback({status : 500,
                        message: 'Internal Server Error'
                     })
                }
                else{
                    console.log('amount is rolled back to user account')
                    callback(null,{
                        status: 500,
                        message: 'Transaction Failure.Amount is rolled back to user account'
                    })
                }
            })
         }
else{
    console.log('Account Does Not Exists in DB')
    callback({status : 404,
            message: 'Account Does Not Exist in DB'
    })
  }
})
}



module.exports = router;