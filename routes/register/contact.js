const express = require('express');
const router = express.Router();
const db = require('./../../database/models');
const CONTACT = db.contact;


router

.post('/addfeedback', async (req, res) => {

    CONTACT.create({
            phoneNumber: req.body.phoneNumber,
            name: req.body.name,
            feedback: req.body.feedback,
        }).then((result) => {
            if (result) {
                res.status(201).json({
                    isSuccessful: true,
                    message: 'Thanks for the Feedback'
                });
              
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
    
   

})
.get('/getEnquiry', (req, res) => {
    CONTACT.findAll()
        .then((result) => {
            if (Object.keys(result).length !== 0) {
                res.status(200).json({
                    isValid: true,
                    message: 'Success',
                    enquiry: result
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