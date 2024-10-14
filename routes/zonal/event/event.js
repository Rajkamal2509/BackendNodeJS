const express = require('express');
const router = express.Router();
const db = require('./../../../database/models');
const EVENT = db.event;
const EVENTQUESTION = db.event;
const readXlsxFile = require("read-excel-file/node");
const path = require("path");
const uploads = require("../../../middlewares/middleware.js");
const { QueryTypes } = require("sequelize");


router
    .post('/createEvent',(req, res) => {
        EVENT.create({
            zone: req.body.zone,
            district: req.body.district,
            date: req.body.date,
            user: req.body.user
        })
            .then((result) => {
                if (result) {
                    res.status(200).json({
                        isValid: true,
                        message: "Event added successfully"
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
                    message: "Unable to add the Event."
                })
            })
    })
    .post('/createEventQuestions',(req, res) => {
        EVENTQUESTION.create({
            eventId: req.body.eventId,
            roundNumber: req.body.roundNumber,
            questionId: req.body.questionId,
            user: req.body.user
        })
            .then((result) => {
                if (result) {
                    res.status(200).json({
                        isValid: true,
                        message: "EventQuestion added successfully"
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
                    message: "Unable to add the EventQuestion."
                })
            })
    })
module.exports = router