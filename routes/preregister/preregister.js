const express = require('express');
const router = express.Router();
const db = require('./../../database/models');
const PREREGISTER = db.preregister

router
    .post('/addPreregister', async (req, res) => {
        let mobileNumber = req.body.mobileNumber;
        let register = await PREREGISTER.findOne({ where: { mobileNumber: mobileNumber } })

        if (!register) {
            PREREGISTER.create({
                mobileNumber: mobileNumber,

            }).then((result) => {
                if (result) {
                    res.status(201).json({
                        isSuccessful: true,
                        message: 'Thank you for Subscribing to updates!'
                    });
                    console.log('Admin has bedd added Successfully.')
                }
                else {
                    res.status(501).json({
                        isSuccessful: false,
                        message: 'Error in adding data.'
                    });
                }
            }).catch((err) => {
                res.status(433).json({
                    isSuccessful: false,
                    err: err.message,
                    message: "Unable to add the Mobilenumber"
                })
            });
        }
        else {
            res.status(201).json({
                isSuccessful: true,
                // token : jwt,
                message: 'Already Registered    .'
            });
        }

    })

    .get('/getPreregister', (req, res) => {
        PREREGISTER.findAll()
            .then((result) => {
                if (Object.keys(result).length !== 0) {
                    res.status(200).json({
                        isValid: true,
                        message: 'Success',
                        preregister: result
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


module.exports = router