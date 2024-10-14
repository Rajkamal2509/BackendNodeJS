const express = require('express');
const router = express.Router();
const db = require('./../../../database/models');
const EVENT = db.event;
const EVENTQUESTION = db.event;
const SCOREBOARD =db.scoreboard
const readXlsxFile = require("read-excel-file/node");
const path = require("path");
const uploads = require("../../../middlewares/middleware.js");
const { QueryTypes } = require("sequelize");
const { sequelize, Sequelize } = require("../../../database/models/");

router
    .post('/createScoreBoard',(req, res) => {
        let SQLQuery = `truncate table quizdb.scoreboards;`;
        let result = sequelize.query(SQLQuery, { type: QueryTypes.TRUNCATE });
        SCOREBOARD.create({
            eventId: req.body.eventId,
            roundNumber: req.body.roundNumber,
            ageGroup: req.body.ageGroup,
            teamA: req.body.teamA,
            teamB: req.body.teamB,
            teamC: req.body.teamC,
            teamD: req.body.teamD
        })
            .then((result) => {
                if (result) {
                    res.status(200).json({
                        isValid: true,
                        message: "ScoreBoard added successfully"
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
                    message: "Unable to add the ScoreBoard."
                })
            })
    })

    .post('/getScoreboard', (req, res) => {
        SCOREBOARD.findAll({
            where: {
                eventId: req.body.eventId,
                ageGroup:req.body.ageGroup
            }
        })
            .then((result) => {
                if (Object.keys(result).length !== 0) {
                    res.status(200).json({
                        isValid: true,
                        message: 'Success',
                        score: result
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