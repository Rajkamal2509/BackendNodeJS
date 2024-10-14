const express = require('express');
const router = express.Router();
const db = require('./../../database/models');
const jwt = require('jsonwebtoken');
const config = require('./../../config/helpers');
const { Sequelize, where } = require('sequelize');
const QUESTION = db.question;
const MODELQUESTION = db.modelQuestion
const SAVEQUIZ = db.answer;
const SCORE = db.score;
const REGISTER = db.register
const TAMIL = db.tamil
const ENGLISH = db.english
const IMAGE = db.image
const configLength = require('./../../config/config')
const readXlsxFile = require("read-excel-file/node");
const { log } = require('console');
const uploads = require("../../middlewares/middleware.js");

const formidable = require('formidable')
const fs = require('fs');
const path = require("path");

router
    .post('/addQuestions', (req, res) => {
        QUESTION.create({
            type: req.body.type,
            prompt: req.body.prompt,
            options: req.body.options,
            answer: req.body.answer
        })
            .then((result) => {
                if (result) {
                    res.status(200).json({
                        isValid: true,
                        message: "Question added successfully"
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
                    message: "Unable to add the question."
                })
            })
    })

    .post('/getQuestions', async (req, res) => {
        console.log(req.body)
        let mobileNumber = req.body.mobileNumber
        let userID = req.body.userID
        let language = req.body.language
        let ageGroup = req.body.ageGroup
        let registerAvailablity = await REGISTER.findOne({
            where: {
                id: userID, mobileNumber: mobileNumber
            }
        })

        if (registerAvailablity) {
            let userScoreStatus = await SCORE.findOne({
                where: {
                    userID: userID, mobileNumber: mobileNumber, isScored: false, language: language
                }
            })
            console.log(userScoreStatus)
            if (userScoreStatus != null) {
                console.log('If')
                let getQuestionIds = await SAVEQUIZ.findAll({
                    attributes: ['id', 'quizID', 'userID', 'questionID', 'questiontype', 'selectedAnswer', 'quizTime', 'isScored', 'score'],
                    where: {
                        quizID: userScoreStatus.id, isScored: false
                    }
                })

                let pendingtime = await SAVEQUIZ.findAll({
                    attributes: ['quizTime'],
                    where: {
                        quizID: userScoreStatus.id, isScored: true,
                        // quizTime : {
                        //     // [Sequelize.Op.gt] : configLength.QUIZTIMER,
                        //     [Sequelize.Op.lt] : configLength.QUIZTIMER
                        // }
                    }
                })
                pendingtime.sort((a, b) => a.quizTime - b.quizTime)
                pendingtime = await pendingtime[0]
                let assignTimer
                if (pendingtime != undefined) {
                    assignTimer = pendingtime.quizTime
                    // assignTimer = configLength.QUIZTIMER - assignTimer
                }
                else {
                    assignTimer = configLength.QUIZTIMER
                }
                console.log(pendingtime)
                console.log('1 getQuestionIds')
                let ids = await getQuestionIds.map(el => { return el.questionID })
                let getQuestion
                console.log('2 outside of the ids If')
                console.log(ids)
                if (ids) {
                    console.log('3 Inside ids If')
                    if (language == 'Tamil') {
                        getQuestion = await TAMIL.findAll({
                            attributes: ['id', 'type', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'answer', 'category'],
                            where: {
                                id: {
                                    [Sequelize.Op.in]: ids
                                }
                            }
                        })
                    }
                    if (language == 'English') {
                        getQuestion = await TAMIL.findAll({
                            attributes: ['id', 'type', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'answer', 'category'],
                            where: {
                                id: {
                                    [Sequelize.Op.in]: ids
                                }
                            }
                        })
                    }

                }
                // console.log(getQuestion)
                console.log('3 getQuestion')

                // console.log(getQuestionIds)
                if (getQuestion) {
                    console.log('4 response send')
                    // console.log(configLength.QUIZTIMER - pendingtime.quizTime)
                    res.status(200).json({
                        isValid: true,
                        message: 'Success',
                        isExisting: true,
                        userID: req.body.userID,
                        quizTimer: assignTimer,
                        totalQuestion: userScoreStatus.totalquestions,
                        attentedQuestion: configLength.DATA_SIZE - getQuestion.length,
                        quizID: userScoreStatus.id,
                        questions: getQuestion,
                        saveQuizIDList: getQuestionIds.sort((a, b) => b.isScored - a.isScored)
                    })
                }

            }
            else {
                console.log('else')
                let scoreDetails = {
                    userID: userID,
                    mobileNumber: mobileNumber,
                    totalquestions: configLength.DATA_SIZE,
                    score: 0,
                    date: "",
                    language: language,
                    isScored: false
                }
                let getAllQuestion
                if (language == 'Tamil') {
                    console.log('Call ', language)
                    if (ageGroup <= 18) {
                        getAllQuestion = await TAMIL.findAll({
                            attributes: ['id', 'type', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'answer', 'category'],
                            where: {
                                category: {
                                    [Sequelize.Op.in]: ['Below 18', 'Both']
                                }
                            }
                        })
                    }
                    if (ageGroup > 18) {
                        getAllQuestion = await TAMIL.findAll({
                            attributes: ['id', 'type', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'answer', 'category'],
                            where: {
                                category: {
                                    [Sequelize.Op.in]: ['Above 18', 'Both']
                                }
                            }
                        })
                    }
                }
                if (language == 'English') {
                    console.log('Call ', language)
                    if (ageGroup <= 18) {
                        getAllQuestion = await TAMIL.findAll({
                            attributes: ['id', 'type', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'answer', 'category'],
                            where: {
                                category: {
                                    [Sequelize.Op.in]: ['Below 18', 'Both']
                                }
                            }
                        })
                    }
                    if (ageGroup > 18) {
                        getAllQuestion = await TAMIL.findAll({
                            attributes: ['id', 'type', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'answer', 'category'],
                            where: {
                                category: {
                                    [Sequelize.Op.in]: ['Above 18', 'Both']
                                }
                            }
                        })
                    }
                }
                console.log("1 getAllQuestion")
                let question = await getAllQuestion.sort((a, b) => 0.5 - Math.random());
                // console.log("1",getAllQuestion)
                console.log("2 question")
                let sliceQuestion = question.slice(0, configLength.DATA_SIZE)
                console.log("3 sliceQuestion")
                console.log(sliceQuestion)
                console.log(scoreDetails)
                let scoreCreate = await SCORE.create({
                    userID: userID,
                    mobileNumber: mobileNumber,
                    totalquestions: configLength.DATA_SIZE,
                    score: 0,
                    date: "",
                    language: language,
                    isScored: false
                })
                // .then(result => console.log(result))
                // .catch(err=> res.json({
                //     message : err,
                //     msg : err.message
                // }))
                console.log("4 scoreCreate for quizID")
                // console.log("Score summery created")
                let saveQuizArray = []
                // if(scoreCreate){
                await sliceQuestion.forEach(element => {
                    let saveQuizObj = {
                        quizID: scoreCreate.id,
                        userID: userID,
                        questionID: element.id,
                        questiontype: element.type,
                        selectedAnswer: "",
                        isScored: false,
                        score: 0
                    }
                    saveQuizArray.push(saveQuizObj)
                });
                // }

                console.log("5 check saveQuizlength and configLength")
                if (saveQuizArray.length == configLength.DATA_SIZE) {
                    SAVEQUIZ.bulkCreate(saveQuizArray, { attributes: ['id', 'quizID', 'userID', 'questionID', 'questiontype', 'selectedAnswer', 'quizTime', 'isScored', 'score'] })
                        .then((result) => {
                            console.log("Questions created")
                            if (result) {
                                res.status(200).json({
                                    isValid: true,
                                    message: 'Success',
                                    isExisting: false,
                                    userID: req.body.userID,
                                    quizTimer: configLength.QUIZTIMER,
                                    totalQuestion: configLength.DATA_SIZE,
                                    attentedQuestion: 0,
                                    quizID: scoreCreate.id,
                                    questions: sliceQuestion,
                                    saveQuizIDList: result
                                })
                            }
                            else {
                                res.status(201).json({
                                    isValid: true,
                                    message: 'Unable Create Random question',
                                })
                            }
                        })
                        .catch(err => {
                            res.status(433).json({
                                isSuccessful: false,
                                err: err.message,
                                message: "Unable to Get Random questions."
                            })
                        })
                }
            }
        }
        else {
            console.log("User not in register table")
        }
    })

    .get('/demoQuestions', async (req, res) => {
        let getAllQuestion = await MODELQUESTION.findAll({ attributes: ['id', 'type', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'answer'] })
        console.log("1 getAllQuestion")
        let question = await getAllQuestion.sort((a, b) => 0.5 - Math.random());
        // let sliceQuestion = question.slice(0, configLength.DEMO_LENGTH)
        if (question) {
            res.status(200).json({
                isValid: true,
                message: 'Success',
                quizTimer: configLength.DEMO_TIMER,
                totalQuestion: configLength.DEMO_LENGTH,
                questions: question
            })
        }
    })

    .post('/saveAnswer', (req, res) => {
        // console.log(req.body)
        SAVEQUIZ.create({
            quizID: req.body.quizID,
            userID: req.body.userID,
            questionID: req.body.questionID,
            questiontype: req.body.questiontype,
            selectedAnswer: req.body.selectedAnswer,
            isScored: req.body.isScored,
            score: req.body.score
        })
            .then((result) => {
                if (result) {
                    res.status(200).json({
                        isValid: true,
                        answerId: result.id,
                        message: "Answer added successfully"
                    })
                }
                else {
                    res.status(201).json({
                        isValid: false,
                        message: 'Error in adding data.'
                    })
                }
            }).catch((err) => {
                res.status(433).json({
                    isSuccessful: false,
                    err: err.message,
                    message: "Unable to add the answer."
                })
            })

    })

    .put('/updateSaveAnswer/:id', (req, res) => {
        console.log(req.body)
        let id = req.params.id
        SAVEQUIZ.update({
            // userID: req.body.userID,
            // questionID: req.body.questionID,
            // questiontype: req.body.questiontype,
            quizTime: req.body.quizTime,
            selectedAnswer: req.body.selectedAnswer,
            isScored: true,
            score: req.body.score
        }, {
            where: {
                id: id, questionID: req.body.questionID, quizID: req.body.quizID
            }
        })
            .then((result) => {
                if (result) {
                    res.status(200).json({
                        isValid: true,
                        answerId: result.id,
                        message: "Answer updated successfully"
                    })
                }
                else {
                    res.status(201).json({
                        isValid: false,
                        message: 'Error in undating data.'
                    })
                }
            }).catch((err) => {
                res.status(433).json({
                    isSuccessful: false,
                    err: err.message,
                    message: "Unable to update the answer."
                })
            })

    })

    .post('/unAttentedQuestions', (req, res) => {
        let unAttentedQuestionList = req.body.unAttentedQuestionList
        SAVEQUIZ.bulkCreate(unAttentedQuestionList)
            .then((result) => {
                if (result) {
                    res.status(200).json({
                        isValid: true,
                        answerIds: result,
                        message: "Bulk data created successfully"
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
                    message: "Unable to add the question."
                })
            })
    })

    .post('/uploadQuestions', uploads.single("file"), async (req, res) => {
        console.log("req.file");
        console.log(req.body.language)
        // console.log(req.file);
        // console.log(req.language);

        try {
            if (req.file == undefined) {
                return res.status(400).send("Please upload an excel file!");
            }
            let path = __basedir + "/public/question/" + req.file.filename;
            // let cerNewPath = path.join(__dirname, '../../public/question')
            //         + '/' + req.file.filename
            let tutorials = [];
            await readXlsxFile(path).then((rows) => {
                //   skip header
                rows.shift();
                rows.forEach((row) => {
                    // console.log(row[3])
                    let tutorial = {
                        type: row[0],
                        question: row[1],
                        optionA: row[2],
                        optionB: row[3],
                        optionC: row[4],
                        optionD: row[5],
                        answer: row[6],
                        category: row[7]
                    };
                    tutorials.push(tutorial);
                });
            });
            // let customerProfile = await MODELQUESTION.findAll()
            // console.log(tutorials);
            if (req.body.language == 'Tamil') {
                console.log("Tamil questions Created Successfully.")
                TAMIL.bulkCreate(tutorials)
                    .then(() => {
                        res.status(200).send({
                            isSuccessful: true,
                            message: "Uploaded the file successfully: " + req.file.originalname,
                        });
                    })
                    .catch((error) => {
                        res.status(500).send({
                            isSuccessful: false,
                            message: "Fail to import data into database!",
                            error: error.message,
                        });
                    });
            }

            if (req.body.language == 'English') {
                console.log("English questions Created Successfully.")
                ENGLISH.bulkCreate(tutorials)
                    .then(() => {
                        res.status(200).send({
                            isSuccessful: true,
                            message: "Uploaded the file successfully: " + req.file.originalname,
                        });
                    })
                    .catch((error) => {
                        res.status(500).send({
                            isSuccessful: false,
                            message: "Fail to import data into database!",
                            error: error,
                        });
                    });
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).send({
                isSuccessful: false,
                message: "Could not upload the file: " + req.file.originalname,
            });
        }
    })

    .get('/getEnglishQuestions', (req, res) => {
        ENGLISH.findAll()
            .then((data) => {
                res.status(200).json({
                    isSuccessful: true,
                    Questions: data,
                });
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving tutorials.",
                });
            });
    })

    .get('/getTamilQuestions', (req, res) => {
        TAMIL.findAll()
            .then((data) => {
                res.status(200).json({
                    isSuccessful: true,
                    Questions: data,
                });
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving tutorials.",
                });
            });
    })

    .post('/addBanner', (req, res) => {
        let form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            console.log("files", files)
            console.log("fields", fields)
            if (err) {
                console.log('create banner image upload issue...')
                return false;
            }
           
          
            let fileName 

            if(fields.type == 'image'){
                let cerOldPath = files.file.filepath;
                let cerNewPath = path.join(__dirname, '../../public/bannerImage')
                    + '/' + files.file.originalFilename
                console.log(cerOldPath)
                let cerRawData = fs.readFileSync(cerOldPath);
                fs.writeFile(cerNewPath, cerRawData, (err) => {
                    if (err) {
                        console.log(`banner ${err}`);
                    }
                });
    
                fileName = "/public/bannerImage/" + files.file.originalFilename
            }
            if(fields.type == 'video'){
                fileName = fields.file
            }

            let data = {
                type: fields.type,
                language : fields.language,
                device : fields.device,
                fileName: fileName,
                isActive : true
            }
            IMAGE.create(data).then((result) => {
                if (result) {
                    res.status(201).json({
                        isSuccessful: true,
                        brandId: result.id,
                        message: 'Banner has been added Successfully.'
                    });
                    console.log('Banner has been added Successfully.')
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
                    message: "Unable to add the Banner"
                })
            });
        })
    })

    .put('/updateBanner/:id', (req, res) => {
        let form = new formidable.IncomingForm();
        let id = req.params.id
        form.parse(req, async (err, fields, files) => {
            console.log("files", files)
            console.log("fields", fields)
            if (err) {
                console.log('create banner image upload issue...')
                return false;
            }
           
          
            let fileName 
            let data
            if(fields.type == 'image' && fields.fileChange == 'true'){
                let cerOldPath = files.file.filepath;
                let cerNewPath = path.join(__dirname, '../../public/bannerImage')
                    + '/' + files.file.originalFilename
                console.log(cerOldPath)
                let cerRawData = fs.readFileSync(cerOldPath);
                fs.writeFile(cerNewPath, cerRawData, (err) => {
                    if (err) {
                        console.log(`banner ${err}`);
                    }
                });
                fileName = "/public/bannerImage/" + files.file.originalFilename
                data = {
                    fileName: fileName,
                    isActive : fields.isActive = fields.isActive == 'false' ? false : true
                }
                console.log("1", data)
            }
            if(fields.type == 'image' && fields.fileChange == 'false'){
                data = {
                    isActive : fields.isActive = fields.isActive == 'false' ? false : true
                }
                console.log("2", data)
            }
            if(fields.type == 'video'){
                fileName = fields.file
                data = {
                    fileName: fileName,
                    isActive : fields.isActive = fields.isActive == 'false' ? false : true
                }
                console.log("3", data)
            }

            IMAGE.update(data ,{ where : { id : id}}).then((result) => {
                if (result) {
                    res.status(201).json({
                        isSuccessful: true,
                        message: 'Banner has been updated Successfully.'
                    });
                    console.log('Banner has been updated Successfully.')
                }
                else {
                    res.status(501).json({
                        isSuccessful: false,
                        message: 'Error in updateing data.'
                    });
                }
            }).catch((err) => {
                res.status(433).json({
                    isSuccessful: false,
                    err: err.message,
                    message: "Unable to update the Banner"
                })
            });
        })
    })

    .get('/getBanner', (req, res) => {
        IMAGE.findAll()
            .then((result) => {
                if (Object.keys(result).length !== 0) {
                    res.status(200).json({
                        isSuccessful: true,
                        bannerFiles: result,
                    });
                }
                else {
                    res.status(201).json({
                        isSuccessful: false,
                        message: 'No data found.',
                        bannerFiles: []
                    })
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving the data.",
                });
            });
    })
module.exports = router