var express = require('express')
var router = express.Router()
var userModel = require('../model/user')


/**   api to register users */
router.post('/users/accounts',function(req,res){
    if(!req.body.first_name){
       console.log("Request Body should contain first_name");
       res.status(400).send("Request Body should contain first_name")
    }
    if(!req.body.unique_user_id){
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
    var userBody = req.body
    userModel.findOne({account_no: req.body.account_no},function(err,result){
    if(err){
        console.log('Some Error Occurred')
        res.status(500).send('Internal Server Error'+ err)
    }
    else if(!result){
        userModel(req.body).save((err,data)=>{
            if(err){
                console.log("user Cant be saved in DB")
                res.status(500).send("User Cant be saved in DB. Some Error Occurred"+err)
            }
            else{
                console.log("User successfully created")
                res.status(200).send(data)
            }
        })
        }
        else{
            console.log("User Already Exists")
        }
   })
  }
})

module.exports = router;