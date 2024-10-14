const express = require('express');
const router = express.Router();
const db = require('./../../database/models');
const jwt = require('jsonwebtoken');
const config = require('./../../config/helpers')
const configLength = require('./../../config/config')
const PARTNER = db.partner;
const REGISTER = db.register;
const { QueryTypes } = require("sequelize");

router
    .post('/getPartner' , async(req , res)=>{
        let userID =  req.body.userID
        // let existingPartner = await PARTNER.findAll({ where : { userID : userID}})
        PARTNER.findAll({ 
            attributes: ['id', 'userID','partnerMobileNumber','partnerName'],
            where : { userID : userID}
        }).then((result)=>{
            if(Object.keys(result).length !== 0){
                res.status(200).json({
                    isValid: true,  
                    message: "Success",
                    partnerList : result
                })
            }
            else{
                res.status(404).json({
                    isValid: false,
                    message: 'No data Found'
                })
            }
        })
        .catch(err=>{
            res.status(433).json({
                isSuccessful: false,
                err: err.message,
                message: "Unable to add the Partner"
            })
        })
        
    })
    .post('/addPartner', async(req,res)=>{
        let userID =  req.body.userID
        let partnerMobileNumber =  req.body.partnerMobileNumber
        // let array = []
        let existingPartner = await PARTNER.findOne({ where : {partnerMobileNumber :partnerMobileNumber}})
        let registerUser = await REGISTER.findOne({ where : { mobileNumber: partnerMobileNumber}})
        if(!existingPartner){
            if(!registerUser){
                PARTNER.create({
                    userID : userID,
                    partnerMobileNumber :partnerMobileNumber,
                    partnerName : req.body.partnerName
                }).then((result)=>{
                    console.log('Partner added successfully')
                    if(result){
                        res.status(200).json({
                            isValid: true,  
                            partnerId : result.id,
                            message: "Partner added successfully"
                        })
                    }
                    else{
                        res.status(201).json({
                            isValid: false,
                            message: 'Error in adding data.'
                        })
                    }
                })
                .catch(err=>{
                    res.status(433).json({
                        isSuccessful: false,
                        err: err.message,
                        message: "Unable to add the Partner"
                    })
                })
            }
            else{
                res.status(200).json({
                    isValid: false, 
                    partnerId : registerUser.id,
                    message: "User already exists in our database"
                })
            }
        }
        else{
            res.status(200).json({
                isValid: false, 
                partnerId : existingPartner.id,
                message: "Partner already exists in our database"
            })
        }
        // partners.map(async item=>{
        //     let existingPartner = await PARTNER.findOne({ where : {partnerMobileNumber : item.partnerMobileNumber}})
            
        //     if(!existingPartner){
        //         Object.assign(item, {isExisting : false})
        //         array.push(item)
        //         // console.log(item)
                // PARTNER.create({
                //     userID : userID,
                //     partnerMobileNumber : item.partnerMobileNumber,
                //     partnerName : item.partnerName
                // }).then(result=>console.log('Partner added successfully'))
                // .catch(err=>console.log(err.message))
        //     }
        //     else{
        //         Object.assign(item, {isExisting : true})
        //         array.push(item)
        //         // console.log(item)
        //         console.log("Already existing partner")
        //     }
        //     if(array.length == configLength.partnerLength){
        //        let addUser = array.filter(i=> i.isExisting == false)
        //        let existingUser = array.filter(i=> i.isExisting == true)
        //        if(addUser.length != 0){
        //             res.status(200).json({
        //                 "isValid": true, 
        //                 "message": "OTP has been sent to the registered mobile number."
        //             }) 
        //        }
        //        if(existingUser.length != 0){
                    // res.status(400).json({
                    //     "isValid": false, 
                    //     "message": "User already exists in our database"
                    // })
        //         }
               
        //     }
        // })   
    })
    .delete('/deletePartner/:id', async(req, res)=>{
        let id = req.params.id
        PARTNER.destroy({ 
            where : {
                id : id
            }
        })
        .then((result)=>{
            if(result){
                res.status(200).json({
                    isValid: true, 
                    partnerId : result.id,
                    message: "Partner deleted successfully"
                })
            }
            else{
                res.status(201).json({
                    isValid: false,
                    message: 'Error in deleting data.'
                })
            }
        })
        .catch(err=>{
            res.status(433).json({
                isSuccessful: false,
                err: err.message,
                message: "Unable to delete the Partner"
            })
        })
    })
    .get('/getPartnerDetails', async(req, res) => {

        let finalList = await db.sequelize.query("select distinct userID, partnerName,partnerMobileNumber,R.name, R.district,R.age, R.mobileNumber from partners as SS left join registers as R on R.id = SS.userID group by userID, partnerName,partnerMobileNumber,R.name order by userID desc LIMIT 0,18446744073709551615", {type: QueryTypes.SELECT});
        // console.log(finalList);
        if (finalList) {
            res.status(200).json({
                isValid: true,
                message: 'Success',
                partner: finalList
            })
        }
        else{
            res.status(433).json({
                isSuccessful: false,
                err: err.message,
                message: "Unable to get data."
            })
        }
        // PARTNER.findAll()
        //     .then((result) => {
        //         if (Object.keys(result).length !== 0) {
        //             res.status(200).json({
        //                 isValid: true,
        //                 message: 'Success',
        //                 partner: finalList
        //             })
        //         }
        //         else {
        //             res.status(201).json({
        //                 isValid: false,
        //                 message: 'No data found.'
        //             })
        //         }
        //     })
        //     .catch((err) => {
        //         res.status(433).json({
        //             isSuccessful: false,
        //             err: err.message,
        //             message: "Unable to get data."
        //         })
        //     })
    })

module.exports = router

