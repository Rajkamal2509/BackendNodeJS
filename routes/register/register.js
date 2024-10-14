const express = require('express');
const router = express.Router();
const db = require('./../../database/models');
const jwt = require('jsonwebtoken');
const config = require('./../../config/config')
const keyConfig = require('./../../config/helpers')
const moment = require('moment')
const REGISTER = db.register;
const SCORE = db.score;
const DISTRICT = db.district
const PARTNER = db.partner
const IMAGE = db.image
const VISITOR = db.visitorCount
const request = require('request-promise');
const { getAuth, signInWithPhoneNumber } = require("firebase/auth");
const _cacheClear = require("node-cache");
const _cache = new _cacheClear({stdTTL: 0});
const auth = require('../../authorization/smsSend')
const { QueryTypes } = require("sequelize");

const otp = require('../../authorization/otpAuth');
const NodeCache = require('node-cache');

router
    .post('', async (req, res) => {
        var phoneNumber = req.body.mobileNumber
        var otpsend = await otp.sendOtp(phoneNumber)
        console.log(otpsend)
    })

    .post('/register', async (req, res) => {
        let existingStd = await REGISTER.findOne({ where: { mobileNumber: req.body.mobileNumber } })
        let checkPartner = await PARTNER.findOne({ where: { partnerMobileNumber: req.body.mobileNumber } })
        let age = moment(req.body.dob, "DD-MM-YYYY").fromNow().split(" ")[0];
        console.log("age", Number(age))
        let otp = await generateOTP()
        console.log(otp)
        let data = {
            name: req.body.name,
            mobileNumber: req.body.mobileNumber,
            dob: req.body.dob,
            gender: req.body.gender,
            district: req.body.district,
            age: Number(age),
            otp: otp
        }
        console.log(data)
        let token = jwt.sign(data, keyConfig.secret, { expiresIn: '1h' });
        let refreshToken = jwt.sign(data, keyConfig.secret, { expiresIn: '1d' });


        let otpRequest = {
            userid: config.REQ_BODY.userid,
            password: config.REQ_BODY.password,
            senderid: config.REQ_BODY.senderid,
            msgType: config.REQ_BODY.msgType,
            dltEntityId: config.REQ_BODY.dltEntityId,
            dltTemplateId: config.REQ_BODY.dltTemplateId,
            duplicatecheck: config.REQ_BODY.duplicatecheck,
            sendMethod: config.REQ_BODY.sendMethod,
            sms: [
                {
                    "mobile": [
                        req.body.mobileNumber.toString()
                    ],
                    "msg": `${otp} பதிவுசெய்வதற்கான உங்கள் OTP/ சரிபார்ப்புக் குறியீடு - கலைஞர்IOO`
                }
            ]
        }
        console.log(otpRequest)

        const options = {
            method: 'POST',
            uri: config.OTP_URL,
            body: otpRequest,
            json: true,
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'bwejjr33333333333'
            }
        }

        if (!existingStd && !checkPartner) {
            console.log("if")
            REGISTER.create(data)
                .then((user) => {
                    console.log("New register user:", user.id)
                    if (user) {
                        request(options).then((result) => {
                            if(result){
                                res.status(200).json({
                                    isValid: true,
                                    userID: user.id,
                                    userDetails: user,
                                    otp: otp,
                                    message: "The participant has registered successfully and OTP has been sent to the registered mobile number"
                                }) 
                            }
                            // Update the Cache value once the user is added
                            const _registrationCacheKey = 'registration';
                            if (_cache.has(_registrationCacheKey)) {
                                const totalRegistration = _cache.get(_registrationCacheKey);
                                _cache.set(_registrationCacheKey, totalRegistration + 1);
                            }
                        })
                        .catch ((err) => {
                            res.status(501).json(err);
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
                    console.log(req.body)
                    res.status(433).json({
                        isSuccessful: false,
                        err: err.message,
                        message: "Unable to add the User"
                    })
                })
        }
        else {
            console.log("else")
            console.log(req.body)
            res.status(200).json({
                isValid: false,
                message: "User already exists in our database"
            })
        }
    })

    .post('/existingUser', async (req, res) => {
        console.log(req.body)
        let existingStd = await REGISTER.findOne({ where: { mobileNumber: req.body.mobileNumber } })
        if (!existingStd) {
            res.status(200).json({
                isValid: true,
                message: "New User."
            })
        }
        else {
            res.status(200).json({
                isValid: false,
                userID: existingStd.id,
                message: "User already exists in our database."
            })
        }
    })

    .post('/deleteUser', async (req, res) => {
        console.log(req.body)
        let existingUser = await REGISTER.findOne({ where: { id: req.body.id } })

        if (existingUser) {
            REGISTER.destroy({ where: { id: req.body.id } })
                .then(result => {
                    if (result) {
                        res.status(200).json({
                            isValid: true,
                            message: "User deleted successful."
                        })
                    }
                    else {
                        res.status(200).json({
                            isValid: false,
                            message: "Unable to delete the user."
                        })
                    }
                })
                .catch(err => {
                    res.status(501).json({
                        isValid: true,
                        err: err,
                        message: "Error in deleting data."
                    })
                })
        }
    })

    .post('/getotp', async (req, res) => {
        let existingStd = await REGISTER.findOne({ where: { mobileNumber: req.body.mobileNumber } })
        let checkPartner = await PARTNER.findOne({ where: { partnerMobileNumber: req.body.mobileNumber } })

        let otp = await generateOTP()
        console.log(otp)
        if (!existingStd && !checkPartner) {
            res.status(200).json({
                isValid: true,
                otp: otp,
                message: "OTP has been sent to the registered mobile number"
            })
        }
        else {
            res.status(201).json({
                isValid: false,
                message: "User already exists in our database"
            })
        }
    })

    .post('/verifyotp', async (req, res) => {
        let otp = '1234'
        let data = {
            mobileNumber: req.body.mobileNumber,
            otp: req.body.otp,
            key: req.body.key
        }
        console.log(data)
        let existingStd = await REGISTER.findOne({ where: { mobileNumber: req.body.mobileNumber } })
        let token = jwt.sign(data, keyConfig.secret, { expiresIn: '1h' });
        let refreshToken = jwt.sign(data, keyConfig.secret, { expiresIn: '1d' });

        if (req.body.key == 'login') {
            if (existingStd.otp == req.body.otp) {

                if (existingStd) {
                    res.status(200).json({
                        isValid: true,
                        message: "OTP validation success",
                        token: token,
                        refreshToken: refreshToken,
                        expiresOn: "1hr",
                        userDetails: existingStd
                    })
                }
            }
            else {
                res.status(203).json({
                    isValid: false,
                    message: "OTP is wrong, please try again with the OTP received."
                })
            }
        }
        if (req.body.key == 'signup') {
            // let otp = '123456'
            if (existingStd.otp == req.body.otp) {
                if (existingStd) {
                    res.status(200).json({
                        isValid: true,
                        message: "OTP validation success",
                        token: token,
                        refreshToken: refreshToken,
                        expiresOn: "1hr",
                        userDetails: existingStd
                    })
                }

            }
            else {
                res.status(203).json({
                    isValid: false,
                    message: "OTP is wrong, please try again with the OTP received."
                })
            }
        }
    })

    .post('/login', async (req, res) => {
        let data = {
            mobileNumber: req.body.mobileNumber
        }
        console.log(req.body)
        let otp = await generateOTP()
        console.log(otp)
        let existingStd = await REGISTER.findOne({ where: { mobileNumber: req.body.mobileNumber } })

        let checkPartner = await PARTNER.findOne({ where: { partnerMobileNumber: req.body.mobileNumber } })

        // let token = jwt.sign(data, keyConfig.secret, { expiresIn: '1h' });
        // let refreshToken = jwt.sign(data, keyConfig.secret, { expiresIn: '1d' });
        let otpRequest = {
            userid: config.REQ_BODY.userid,
            password: config.REQ_BODY.password,
            senderid: config.REQ_BODY.senderid,
            msgType: config.REQ_BODY.msgType,
            dltEntityId: config.REQ_BODY.dltEntityId,
            dltTemplateId: config.REQ_BODY.dltTemplateId,
            duplicatecheck: config.REQ_BODY.duplicatecheck,
            sendMethod: config.REQ_BODY.sendMethod,
            sms: [
                {
                    "mobile": [
                        req.body.mobileNumber.toString()
                    ],
                    "msg": `${otp} பதிவுசெய்வதற்கான உங்கள் OTP/ சரிபார்ப்புக் குறியீடு - கலைஞர்IOO`
                }
            ]
        }
        console.log(otpRequest)

        const options = {
            method: 'POST',
            uri: config.OTP_URL,
            body: otpRequest,
            json: true,
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'bwejjr33333333333'
            }
        }

        // res.status(200).json(result);
        if (!checkPartner) {
            if (existingStd) {
                let userOTP = await REGISTER.update({ otp: otp }, { where: { id: existingStd.id } })
                if (userOTP) {
                    // res.status(200).json({
                    //     isValid: true,
                    //     otp: otp,
                    //     message: "OTP has been sent to the registered mobile number."
                    // })
                    request(options).then((result) => {
                        if (result) {
                            res.status(200).json({
                                isValid: true,
                                otp: otp,
                                message: "OTP has been sent to the registered mobile number."
                            })
                        }
                    })
                    .catch((err) => {
                        res.status(501).json(err);
                    })
                }
                else {
                    console.log("OTP update error", userOTP)
                }
            }
            else {
                res.status(201).json({
                    isValid: false,
                    key: 'login',
                    message: "Not register"
                })
            }
        }
        else {
            res.status(201).json({
                isValid: false,
                key: 'partner',
                message: "Already existing in our database(Like Partner)."
            })
        }
    })

    .post('/otpReset', async (req, res) => {
        console.log(req.body)

        let findOTP = await REGISTER.findOne({ where: { mobileNumber: req.body.mobileNumber } })

        if (findOTP) {
            let userOTP = await REGISTER.update({ otp: 0 }, { where: { id: findOTP.id } })
            if (userOTP) {
                res.status(200).json({
                    isValid: true,
                    message: "Updated Successful."
                })
            }
        }
    })

    .post('/resentOTP', async (req, res) => {
        let existingStd = await REGISTER.findOne({ where: { mobileNumber: req.body.mobileNumber } })
        let otp = await generateOTP()
        console.log(otp)

        let otpRequest = {
            userid: config.REQ_BODY.userid,
            password: config.REQ_BODY.password,
            senderid: config.REQ_BODY.senderid,
            msgType: config.REQ_BODY.msgType,
            dltEntityId: config.REQ_BODY.dltEntityId,
            dltTemplateId: config.REQ_BODY.dltTemplateId,
            duplicatecheck: config.REQ_BODY.duplicatecheck,
            sendMethod: config.REQ_BODY.sendMethod,
            sms: [
                {
                    "mobile": [
                        req.body.mobileNumber.toString()
                    ],
                    "msg": `${otp} பதிவுசெய்வதற்கான உங்கள் OTP/ சரிபார்ப்புக் குறியீடு - கலைஞர்IOO`
                }
            ]
        }
        console.log(otpRequest)

        const options = {
            method: 'POST',
            uri: config.OTP_URL,
            body: otpRequest,
            json: true,
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'bwejjr33333333333'
            }
        }

        if (existingStd) {
            let userOTP = await REGISTER.update({ otp: otp }, { where: { id: existingStd.id } })
            if (userOTP) {
                // res.status(200).json({
                //     isValid: true,
                //     otp: otp,
                //     message: "OTP has been sent to the registered mobile number."
                // })
                request(options).then((result) => {
                    if (result) {
                        res.status(200).json({
                            isValid: true,
                            otp: otp,
                            message: "OTP has been resent to the registered mobile number."
                        })
                    }
                })
                .catch((err) => {
                    res.status(501).json(err);
                })
            }
        }
        else {
            res.status(201).json({
                isValid: false,
                message: "Not register"
            })
        }

    })

    .post('/getBannerImage', async (req, res) => {
        const _bannerforMobileCacheKey = 'banner_mobile';
        const _bannerforWebCacheKey = 'banner_web';
        console.log(req.body.language);
        let _bannerCacheKey;
        let bannerImage;
        const device = req.body.device;

        const language = req.body.language;



        if (device == "mobile") {

            _bannerCacheKey = _bannerforMobileCacheKey;

         
        }else _bannerCacheKey = _bannerforWebCacheKey;
        console.log(_bannerCacheKey);



        
        if (_cache.has(_bannerCacheKey)){
            console.log('cache detected: Banner');
            if(language=='English'){
                bannerImage = await IMAGE.findAll(
                    { 
                        where: { 
                            device: device, 
                            language: req.body.language, 
                            isActive: true 
                        } 
                    });
            _cache.set(_bannerCacheKey, bannerImage);
            }
            else if(language=='Tamil'){
                bannerImage = await IMAGE.findAll(
                    { 
                        where: { 
                            device: device, 
                            language: req.body.language, 
                            isActive: true 
                        } 
                    });
            _cache.set(_bannerCacheKey, bannerImage);
            }

            // bannerImage = _cache.get(_bannerCacheKey);
        }else{
            bannerImage = await IMAGE.findAll(
                    { 
                        where: { 
                            device: device, 
                            language: req.body.language, 
                            isActive: true 
                        } 
                    });
            _cache.set(_bannerCacheKey, bannerImage);
        }

        if (bannerImage) {
            res.status(200).json({
                isValid: true,
                message: "Success",
                bannerList: bannerImage
            })
        }
        else {
            res.status(201).json({
                isValid: false,
                message: "No data Found",
                bannerList: []
            })
        }
    })

    .get('/leaderBoard', (async (req, res) => {
        // let bannerImage = await IMAGE.findAll({where : { device : req.body.device , language : req.body.language , isActive : true }})
        const _registrationCacheKey = 'registration';
        const _totalQuizCacheKey = 'totalquiz';
        const _totlPageVisitors = 'totlPageVisitors';
        const _top10List = 'top10List';

        let registerCount = 0;
        if (_cache.has(_registrationCacheKey)){
            console.log('cache detected: Registration');
            registerCount = _cache.get(_registrationCacheKey);
        }
        else{
            console.log('cache not detected: Registration');
            registerCount = await REGISTER.count();
            _cache.set(_registrationCacheKey, registerCount);
        }
        let scoreSummary = 0;

        if (_cache.has(_totalQuizCacheKey)){
            console.log('cache detected: TotalQuiz')
            scoreSummary = _cache.get(_totalQuizCacheKey);
        }else{
            console.log('cache not detected: TotalQuiz');
            scoreSummary = await SCORE.count({
                where: {
                    isScored: true
                }
            });
            _cache.set(_totalQuizCacheKey, scoreSummary);
        }
        
        let visitorCount = 0;
        if(_cache.has(_totlPageVisitors)){
            console.log('cache detected: PageVisitors');
            visitorCount = _cache.get(_totlPageVisitors);
        }else{
            console.log('cache not detected: PageVisitors');
            visitorCount = visitorCount = await VISITOR.findAll({
                attributes: [
                    'count'
                ],
            });
            _cache.set(_totlPageVisitors, visitorCount);
        }

        let finalList;
        if (_cache.has(_top10List)){
            console.log('cache detected: top10list');
            finalList = _cache.get(_top10List);
        }
        else{
            console.log('cache not detected: top10list');
            finalList = await db.sequelize.query("select distinct userID, totalquestions, max(score) as score, R.name, R.district, R.mobileNumber from scoreSummaries as SS left join registers as R on R.id = SS.userID group by userID, totalquestions, R.name order by score desc LIMIT 10", {type: QueryTypes.SELECT});
            _cache.set(_top10List, finalList);
        }
        
        if (finalList) {
            res.status(200).json({
                isValid: true,
                message: "Success",
                registerCount: registerCount,
                visitorCount: visitorCount,
                scoreSummary: scoreSummary,
                scoreList: finalList
            })
        }
    }))

    .get('/getDistrict', (req, res) => {
        DISTRICT.findAll({
            where: {
                isActive: true
            }
        })
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

    .post('updateVisitor', async (req, res) => {
        console.log(req.body)
        let existingCount = await VISITOR.findOne({ where: { id: req.body.id } })
        if (existingCount) {
            let count = existingCount.count + req.body.count
            VISITOR.update({ count: count }, { where: { id: existingCount.id } })
                .then((result) => {
                    if (result) {
                        res.status(200).json({
                            isValid: true,
                            message: "Visitor count has been updated successful."
                        })
                    }
                    else {
                        res.status(201).json({
                            isValid: true,
                            message: "Error in updating data."
                        })
                    }
                })
                .catch(err => {
                    res.status(501).json({
                        isValid: true,
                        err: err,
                        message: "Unable to update."
                    })
                })
        }
        else {
            VISITOR.create({
                visitor: req.body.visitor,
                count: req.body.count
            })
                .then((result) => {
                    if (result) {
                        res.status(200).json({
                            isValid: true,
                            message: "Visitor added successfully"
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
                        message: "Unable to add the Visitor count."
                    })
                })
        }
    })


  
module.exports = router

function generateOTP() {
    let digit = '0123456789'
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digit[Math.floor(Math.random() * 10)]
    }
    return otp
}

async function leaderBoard(scoreList) {
    let highestList = []
    let highestScore
    scoreList.map(item => {
        item.scoreSummaries.sort((a, b) => b.score - a.score)
        // Object.assign(item , { score : item.scoreSummaries.scoreSummary})
        // console.log(item) 
        // console.log(item.mobileNumber.toString().slice(5,-1))
        let number = 'XXXXXX' + item.mobileNumber.toString().slice(6).toString()
        let ScorUserID
        let mobileNumber
        let score = item.scoreSummaries.map((i, index) => {
            if (index == 0) {
                // mobileNumber = i.mobileNumber
                ScorUserID = i.userID
                return i.score
            }
        })
        console.log(score[0])
        if (score[0] != undefined) {
            highestList.push({
                uerID: item.id,
                name: item.name,
                district: item.district,
                mobileNumber: number,
                // ScorUserID : ScorUserID,
                // s_mobileNumber : mobileNumber,
                score: score[0],
            })
            highestList.sort((a, b) => b.score - a.score)
        }

    })
    return highestList
}

function otpRequest(phoneNumber) {
    // firebase.auth()
    // .signInWithPhoneNumber(mobileNumber, true)
    // .then(function(confirmationResult) {
    //     console.log(confirmationResult)
    //     window.confirmationResult = confirmationResult;
    // })
    // .catch(function(error) {
    //     console.log(error);
    // });
    signInWithPhoneNumber(auth, phoneNumber, true)
        .then((confirmationResult) => {
            console.log(confirmationResult)
            return
        })
        .catch((err) => {
            console.error(err);
            // return res.status(500).json({ 
            //     error: err 
            // });
        });
}