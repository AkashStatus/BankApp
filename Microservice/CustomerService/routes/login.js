var express = require('express')
var router = express.Router()
var UserModel = require('../model/user')
var loginStatusModel = require('../model/loginStatus')

router.post('/users/accounts/login',function(req,res){
   if(!req.body._id){
    console.log("Request Body should contain _id");
    res.status(400).send("Request Body should contain _id")
   }
   else if(!req.body.password){
    console.log("Request Body should contain password");
    res.status(400).send("Request Body should contain password")
   }
   else{
    UserModel.findOne({_id: req.body._id},function(err,user){
        if(err){
            console.log('Some Error Occurred')
            res.status(500).send('Internal Server Error'+ err)
        }
        else if(user){
            user= JSON.parse(JSON.stringify(user));
        if(req.body.password === user.password){
            var loginStatusObject  = {
                user_id: req.body._id,
                login_on: new Date()
            }
            loginStatusModel(loginStatusObject).save((err,result)=>{
                if(err){
                console.log('Error in creating User Login Status')
                res.status(500).send('Internal Server Error'+err)
                   }
                else{
                console.log('User logged in successfully')
                res.status(200).send('success')
             }
           })
          }
          else{
            console.log('Cant login User. user_id or password mismatches')
            res.status(400).send('Please provide correct user_id and password')
          }
        }
        else{
        console.log('user does not exist with user_id'+req.body.user_id)
       }
    })
  }
})

module.exports = router;