const express = require('express');
const router = express.Router();
const db = require('./../../database/models');
const { log } = require('firebase-functions/logger');
const DISTRICT = db.district;
const REGISTER = db.register;


router

    .get('/getDistrict', (req, res) => {
        DISTRICT.findAll()
            .then((result) => {
                if (Object.keys(result).length !== 0) {
                    res.status(200).json({
                        isValid: true,
                        message: 'Success',
                        district: result
                    })
                }
                else {
                    res.status(201).json({
                        isValid: false,
                        message: 'No data found.'
                    })
                }
            })
            .catch((err) => {
                res.status(433).json({
                    isSuccessful: false,
                    err: err.message,
                    message: "Unable to get data."
                })
            })
    })


    .post('/addDistrict', (req, res) => {
        let data = {
            districtName: req.body.districtName,
            isActive: req.body.isActive
        }

        DISTRICT.create({
            districtName: req.body.districtName,
            zoneName: req.body.zoneName,
            isActive: true
        })
            .then((result) => {
                if (result) {
                    res.status(200).json({
                        isValid: true,
                        districtID: result.id,
                        message: "District created successfully."
                    })
                }
                else {
                    res.status(201).json({
                        isValid: false,
                        message: 'Error in adding data.'
                    })
                }
            })
            .catch((err) => {
                res.status(433).json({
                    isSuccessful: false,
                    err: err.message,
                    message: "Unable to add the District"
                })
            })
    })

    .put('/updateDistrict/:id', (req, res) => {
        let id = req.params.id
        console.log(req.body)
        DISTRICT.update({
            districtName: req.body.districtName,
            isActive: req.body.isActive
        }, {
            where: {
                id: id
            }
        })
            .then((result) => {
                if (result) {
                    res.status(200).json({
                        isValid: true,
                        district: result.id,
                        message: "District updated successfully"
                    })
                }
                else {
                    res.status(201).json({
                        isValid: false,
                        message: 'Error in undating data.'
                    })
                }
            })
            .catch((err) => {
                res.status(433).json({
                    isSuccessful: false,
                    err: err.message,
                    message: "Unable to update the district."
                })
            })
    })


    .get('/getRegisterDetails', (req, res) => {
        REGISTER.findAll()
            .then((result) => {
                if (Object.keys(result).length !== 0) {
                    res.status(200).json({
                        isValid: true,
                        message: 'Success',
                        registerDetails: result
                    })
                }
                else {
                    res.status(201).json({
                        isValid: false,
                        message: 'No data found.'
                    })
                }
            })
            .catch((err) => {
                res.status(433).json({
                    isSuccessful: false,
                    err: err.message,
                    message: "Unable to get data."
                })
            })
    })
    .post('/filterDistrict', async (req, res) => {


        if(req.body.district==""){
          await  REGISTER.findAll()
            .then((result) => {
                if (Object.keys(result).length !== 0) {
                    res.status(200).json({
                        isValid: true,
                        message: 'Success',
                        registerDetails: result
                    })
                }
                else {
                    res.status(201).json({
                        isValid: false,
                        message: 'No data found.'
                    })
                }
            })
            .catch((err) => {
                res.status(433).json({
                    isSuccessful: false,
                    err: err.message,
                    message: "Unable to get data."
                })
            })
        }
        else{
        await  REGISTER.findAll({
                where: {
                    district: req.body.district
                }
            })
                .then((users) => {
                    res.status(200).json({
                        isValid: true,
                        message: 'Success',
                        registerDetails: users
                    })
                })
                .catch(err => {
                   
                    res.json({
                        status: 500,
                        success: false,
                        err: err,
                        message: "Some error occurred while retrieving message."
                    })
                });
        }

   

    })
module.exports = router