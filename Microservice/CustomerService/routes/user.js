var express = require('express')
var router = express.Router()
var userModel = require('../model/user')
var accountModel = require('../model/account')
var moment= require('moment')
/**   api to register users */
router.post('/users/accounts',function(req,res){
    if(!req.body.first_name){
       console.log("Request Body should contain first_name");
       res.status(400).send("Request Body should contain first_name")
    }
    else if(!req.body.unique_user_id){
        console.log("Request Body should contain user_id");
        res.status(400).send("Request Body should contain user_id")
     }
    else if(!req.body.password){
        console.log("Request Body should contain password");
        res.status(400).send("Request Body should contain password")
    }
    else if(!req.body.account_no){
        console.log("Request Body should contain account_no");
        res.status(400).send("Request Body should contain account_no")
    }
    else {
    userModel.findOne({unique_user_id: req.body.unique_user_id},function(err,result){
    if(err){
        console.log('Some Error Occurred')
        res.status(500).send('Internal Server Error'+ err)
    }
    else if(!result){
        userObject = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            mobile_no: req.body.mobile_no,
            unique_user_id: req.body.unique_user_id,
            password: req.body.password

        }
        userModel(userObject).save((err,user)=>{
            if(err){
                console.log("user cant be saved in DB")
                res.status(500).send("User Cant be saved in DB. Some Error Occurred"+err)
            }
            else{
                console.log("User successfully created")
                accountObject = {
                    user_id : user._id,
                    bank_address:  req.body.bank_address,
                    account_no: req.body.account_no,
                    account_type:  req.body.account_type,
                    branch_name: req.body.branch_name
                }
                accountModel(accountObject).save((err,result)=>{
                    if(err){
                        console.log('account details not saved in DB'+err)
                         res.status(500).send('account details not saved in DB')
                     }
                     else{
                        console.log('Account details saved')
                        res.status(200).send(user)
                     }
                })
            }
        })
        }
        else{
            console.log("User Already Exists")
            res.status(400).send('User Already Exists')
        }
   })
  }
})



router.get('/users/:userId/accounts/balance',function(req,res){
    accountModel.findOne({user_id: req.params.userId},{net_balance: 1 , _id : 0},function(err,accountBalance){
        if(err){
            console.log('Some Error Occurred')
            res.status(500).send('Internal Server Error'+ err)
        }
        else{
            res.status(200).send(accountBalance)
        }
    })
})


router.post('/users/interest',function(req,res){
    /** Assuming 4 % interest is given on quarterly bases.*/
    if(!req.body.userId){
        console.log('Please provide userId in request body')
        res.status(400).send('Please provide userId in request body')
 }
    if(!req.body.date){
           console.log('Please provide date in request body')
           res.status(400).send('Please provide date in request body')
    }
    else{
           /** Assuming i get future date in  this format "2018-11-04" */

           var startDate = moment(new Date())
           var endDate = moment(req.body.date)
           day_difference = endDate.diff(startDate , "days")
           accountModel.findOne({user_id: req.body.userId},function(err,user){
              if(err){
                  console.log('Internal Server Error'+err)
                  res.status(500).send('Internal Server Error')
              }
              else if(user){
                        interestAmount = (user.net_balance * 4 * day_difference)/(100 * 90)
                       console.log('Interest for given date is'+ interestAmount)
                       res.status(200).send({interest: interestAmount})
              }
              else{
                  console.log('User Account does not exist')
                  res.status(400).send('User Account does not exist')
              }
        })
    }
})
module.exports = router;