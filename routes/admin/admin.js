const express = require('express');
const router = express.Router();
const db = require('./../../database/models');
const ADMINTAB = db.admin
const keyConfig = require('../../config/helpers')
const config = require('./../../config/config')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const REGISTER = db.register;
const SCORE = db.score;
const DISTRICT = db.district

router
    .post('/admin', async(req, res) => {
        let adminName = req.body.adminName;
        let password = req.body.password;
        console.log("---Admin add--->", req.body.adminName, password)
        let admin = await ADMINTAB.findOne({ where: { adminName: adminName } })
        
        if(!admin){
            ADMINTAB.create({
                adminName: adminName,
                password: bcrypt.hashSync(password, 8),
            }).then((result) => {
                if (result) {
                    res.status(201).json({
                        isSuccessful: true,
                        message: 'Admin has been added Successfully.'
                    });
                    console.log('Admin has been added Successfully.')
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
                    message: "Unable to add the Admin"
                })
            });
        }
        else{
            res.status(201).json({
                isSuccessful: true,
                // token : jwt,
                message: 'Already existing admin.'
            });
        }
       
    })

    .post('/adminLogin', async (req, res) => {
        let adminName = req.body.adminName;
        let password = req.body.password;
        console.log("---Admin add--->", adminName, password)
        let admin = await ADMINTAB.findOne({ where: { adminName: adminName } })
        console.log(admin)
        if (admin  ===  null) {
            res.status(202).json({
                isSuccessful: false,
                message: "Admin Not found."
            });
        }
        else {
            ADMINTAB.findOne({
                where: { adminName: adminName }
            }).then((result) => {
                console.log(result)
                let passwordIsValid
                if (result != null) {
                    passwordIsValid = bcrypt.compareSync(
                        password,
                        result.password
                    );
                }
                if (!result) {
                    res.status(204).json({
                        isSuccessful: false,
                        message: "Admin Not found."
                    });
                }
                else if (passwordIsValid == false) {
                    res.status(201).send({
                        isSuccessful: false,
                        message: "Invalid Password!"
                    });
                }
                else {
                    let token = jwt.sign({ id: result.id }, keyConfig.secret);
                    res.status(200).json({
                        isSuccessful: true,
                        message: "Login Successful",
                        adminName : admin.adminName,
                        accessToken: token
                    });
                }

            }).catch((err) => {
                res.status(433).json({
                    isSuccessful: false,
                    err: err.message,
                    message: "Some error occurred while retrieving data documents detail"
                })
            });
        }


        // successRedirect : '/home'
    })

    

module.exports = router
