var express = require('express')
var router = express.Router()
var UserModel = require('../model/user')
var beneficiaryUserModel = require('../model/benificiary')

router.post('/users/beneficiary',function(req,res){
    if(!req.body.beneficiary_user_id){
        console.log("Request Body should contain beneficiary_user_id");
        res.status(400).send("Request Body should contain beneficiary_user_id")
    }
    else if(!req.body.user_id){
        console.log("Request Body should user_id");
        res.status(400).send("Request Body should user_id")
    }
    else if(!req.body.beneficiary_account_no){
        console.log("Request Body should contain beneficiary_account_no");
        res.status(400).send("Request Body should contain beneficiary_account_no")
    }
    else{
        UserModel.findOne({_id: req.body.beneficiary_user_id},function(err,beneficiaryUser){
            if(err){
                console.log('Some Error Occurred')
                res.status(500).send('Internal Server Error'+ err)
            }
            else if(beneficiaryUser){
                beneficiaryUser = JSON.parse(JSON.stringify(beneficiaryUser));
                var beneficiaryObject = {};
                Object.keys(req.body).forEach((key) => {
                    beneficiaryObject[key] = req.body[key];
                })
                beneficiaryUserModel(beneficiaryObject).save((err,result)=>{
                    if(err){
                        console.log("user Cant be saved in DB")
                        res.status(500).send("User Cant be saved in DB. Some Error Occurred"+err)
                    }
                    else{
                        console.log("beneficiary added successfully")
                        res.status(200).send(result)
                    }
                })
            }
            else{
                console.log('beneficiary user does not exist')
                res.status(400).send('beneficiary user does not exist')
            }
        })
    }

})


router.delete('/users/:userId/beneficiary/:beneficiaryId',function(req,res){
        beneficiaryUserModel.remove({beneficiary_user_id: req.params.beneficiaryId},function(err,result){
            if(err){
                console.log('Cant Delete beneficiary user using beneficiaryId: '+req.params.beneficiaryId)
                res.status(500).send('Cant Delete beneficiary user using beneficiaryId'+req.params.beneficiaryId)
            }
            else{
                console.log('beneficiary deleted')
                res.status(200).send('success')
            }
        })
})

module.exports = router;