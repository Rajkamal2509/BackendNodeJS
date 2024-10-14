const express = require('express');
const router = express.Router();
const db = require('./../../database/models');
const jwt = require('jsonwebtoken');
const config = require('./../../config/config');
const { Sequelize, score } = require('./../../database/models');
const { where } = require('sequelize');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable')
// const publicFile = require('../../public/canvasImags')
const Op = Sequelize.Op;
const REGISTER = db.register;
const SCORE = db.score;
const SAVEQUIZ = db.answer;
const PARTNER = db.partner;

router
    .post('/uploadImage', async (req, res) => {
        // File Upload
        // let form = new formidable.IncomingForm();
        // form.parse(req, async (err, fields, files) => {
        //     console.log("files", files)
        //     console.log("fields", fields)
        //     if (err) {
        //         console.log('Canvas Image uploaded error...')
        //         return false;
        //     }
        //     else{
        //         let cerOldPath = files.canvasImg.filepath;
        //         let cerNewPath = path.join(__dirname, '../../public/canvasImags')
        //             + '/' + 'canvas'+fields.id
        //         console.log(cerOldPath)
        //         let cerRawData = fs.readFileSync(cerOldPath);
        //         fs.writeFile(cerNewPath, cerRawData, (err) => {
        //             if (err) {
        //                 console.log(`brandLogo ${err}`);
        //             }
        //         });
        //     }
        // })

        // Base64
        console.log(req.body)
        let id = req.body.scoreSummarID
        let base64Img = req.body.base64Img
        //-->   /^data:image\/\w+;base64,/, "" 
        // let replacePrefix = base64Img.replace(/^data:image\/[a-z]+;base64,/, "")
        // let bufferDate = Buffer.from(replacePrefix , 'base64')
        let bufferDate = Buffer.from(base64Img , 'base64')
        let cerNewPath = path.join(__dirname, '../../public/canvasImags')
                    + '/' + 'canvas'+id+'.png'
        let imageName = 'canvas'+id+'.png'
        fs.writeFile(cerNewPath ,bufferDate, (err)=>{
            if(err){
                console.log(`Canvas ${err}`);
            }
            else{
                console.log('Image saved successfully :', cerNewPath)
                res.status(200).json({
                    isValid: true,
                    message: "Success",
                    imageName : imageName
                })
            }
        })
    })


    .post('/addQuizSummary', async (req, res) => {
        // {
        //     [Op.in]: req.body.quizID
        // }
        let data = {
            userID: req.body.userID,
            // mobileNumber : req.body.mobileNumber,
            totalquestions: req.body.totalquestions,
            score: req.body.score,
            date: req.body.date,
            quizID: req.body.quizID
        }
        SCORE.create({
            userID: req.body.userID,
            mobileNumber: req.body.mobileNumber,
            totalquestions: req.body.totalquestions,
            score: req.body.score,
            date: req.body.date
        })
            .then(async (result) => {
                if (result) {
                    console.log(result.id)
                    let updateSaveQuizTab = await SAVEQUIZ.update({
                        quizID: result.id
                    }, {
                        where: {
                            id: req.body.quizID
                        }
                    })
                    if (updateSaveQuizTab) {
                        console.log("SAVEQUIZ table updated Successfully.")
                        res.status(200).json({
                            isValid: true,
                            message: "User score details added successfully."
                        })
                    }

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
                    message: "Unable to add the Score details."
                })
            })
    })

    .post('/quizSummary', async (req, res) => {
        let data = {
            userID: req.body.userID,
            mobileNumber: req.body.mobileNumber
        }
        let partnerLength = await PARTNER.count({
            where: {
                userID: req.body.userID
            }
        })
        SCORE.findAll({
            attributes: ['id', 'totalquestions','questionCount', 'score', 'date', 'isScored'],
            where: {
                mobileNumber: req.body.mobileNumber, isScored: true
            }
        })
            .then((result) => {
                if (Object.keys(result).length !== 0) {
                    res.status(200).json({
                        isValid: true,
                        message: 'Success',
                        questionLength : config.DATA_SIZE,
                        partnerLength: partnerLength,
                        userScoreDetails: result
                    })
                }
                else {
                    res.status(201).json({
                        isValid: false,
                        partnerLength: partnerLength,
                        message: 'No quiz found.'
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

    .put('/updateQuizSummary', async (req, res) => {

        let data = {
            id: req.body.quizID,
            userID: req.body.userID,
            mobileNumber: req.body.mobileNumber,
            date: req.body.date
        }

        let saveQuiz = await SAVEQUIZ.count({
            where: {
                quizID: req.body.quizID, userID: req.body.userID, score: 1
            }
        })

        let findQuiz = await SCORE.findOne({
            where: {
                id: req.body.quizID,
                userID: req.body.userID,
                mobileNumber: req.body.mobileNumber
            }
        })

        if (findQuiz) {
            SCORE.update({
                score: saveQuiz,
                questionCount : req.body.questionCount,
                date: req.body.date,
                isScored: true
            },
                {
                    where: {
                        id: req.body.quizID,
                    }
                })
                .then((result) => {
                    if (result) {
                        console.log(result)
                        res.status(200).json({
                            isValid: true,
                            totalScore: saveQuiz,
                            message: "Score Summary updated successfully"
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
                        message: "Unable to update the Score Summary."
                    })
                })
        }
        else {
            res.status(201).json({
                isValid: false,
                message: 'No data found'
            })
        }
    })

    .post('/districtLeaderBoard', async (req, res) => {
        let district = req.body.district
        // let scoreSummary = await SCORE.count({
        //     where: {
        //         isScored: true
        //     }
        // })
        let scoreList

        if(district != ""){
            scoreList = await REGISTER.findAll({
                include: [{
                    model: SCORE,
                    as: "scoreSummaries", 
                    attributes: [
                        'userID', 'totalquestions', 'score', 'date' , 'questionCount'
                    ],
                }],
                where : {
                    district : district
                }
            })
        }
        if(district == ""){
            scoreList = await REGISTER.findAll({
                include: [{
                    model: SCORE,
                    as: "scoreSummaries", 
                    attributes: [
                        'userID', 'totalquestions', 'score', 'date' , 'questionCount'
                    ],
                }]
            })
        }

        // res.status(200).json({
        //     isValid: true,
        //     scoreList: scoreList
        // })

        let finallist = await leaderBoard(scoreList)

        await finallist.map((i, index) => {
            i.position = index + 1
        })
        // let result = await finallist.slice(0, config.LEADERBOARD_SIZE)
        // console.log(result.length)
        if (finallist) {
            res.status(200).json({
                isValid: true,
                message: "Success",
                // scoreSummary: scoreSummary,
                scoreList: finallist
            })
        }
    })

module.exports = router


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
        let questionCount 
        let score = item.scoreSummaries.map((i, index) => {
            if (index == 0) {
                // mobileNumber = i.mobileNumber
                ScorUserID = i.userID
                questionCount = i.questionCount
                return i.score
            }
        })
        console.log(score[0])
        if (score[0] != undefined) {
            highestList.push({
                uerID: item.id,
                name: item.name,
                district: item.district,
                mobileNumber: item.mobileNumber,
                questionCount : questionCount,
                // ScorUserID : ScorUserID,
                // s_mobileNumber : mobileNumber,
                score: score[0],
            })
            highestList.sort((a, b) => b.score - a.score)
        }

    })
    return highestList
}