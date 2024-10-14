const express = require('express');
const router = express.Router();
const db = require('./../../../database/models');
const ZONALQUESTION = db.zonalquestion;
const readXlsxFile = require("read-excel-file/node");
const path = require("path");
const uploads = require("../../../middlewares/middleware.js");
const { QueryTypes } = require("sequelize");
const configLength = require('../../../config/config');
const { log } = require('console');
router
    .post('/uploadZonalQuestions', uploads.single("file"), async (req, res) => {
        console.log("dddddd");
        try {
            if (req.file == undefined) {
                return res.status(400).send("Please upload an excel file!");
            }
            let path = __basedir + "/public/question/" + req.file.filename;

            let tutorials = [];
            await readXlsxFile(path).then((rows) => {
                rows.shift();
                rows.forEach((row) => {
                    let tutorial = {
                        ZoneNo:row[0],
                        AgeGroup:row[1],
                        RoundNumber:row[2],
                        Questions: row[3],
                        optionA: row[4],
                        optionB: row[5],
                        optionC: row[6],
                        optionD: row[7],
                        Answer: row[8],
                        Category: row[9],
                        assetURL: row[10],
                        displayOrder:row[11],

                    };

                    console.log(tutorial);
                    tutorials.push(tutorial);



                    
                });
            });

            ZONALQUESTION.bulkCreate(tutorials)
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

        } catch (error) {
            res.status(500).send({
                isSuccessful: false,
                message: "Could not upload the file: " + req.file.originalname,
            });
        }
    })


    .post('/getZonalQuestions', async (req, res) => {
        let finalquestions
        let count
        let timer
    
            if(req.body.Category==" "){
              
            finalquestions = await db.sequelize.query("SELECT * FROM `zonalquestions` WHERE  RoundNumber=" + req.body.RoundNumber + " AND AgeGroup=" +JSON.stringify( req.body.AgeGroup) + " AND ZoneNo=" + req.body.ZoneNo, { type: QueryTypes.SELECT });

            }else{
              
            finalquestions = await db.sequelize.query("SELECT * FROM `zonalquestions` WHERE  RoundNumber=" + req.body.RoundNumber + " AND Category="+ JSON.stringify(req.body.Category) + " AND AgeGroup=" + JSON.stringify(req.body.AgeGroup) + " AND ZoneNo=" + req.body.ZoneNo, { type: QueryTypes.SELECT });

            }
            console.log(configLength.ROUND_NUMBER+req.body.Category);
  
           for(let i in configLength.ROUND_NUMBER){
            if(configLength.ROUND_NUMBER[i].round==req.body.RoundNumber){
                count=configLength.ROUND_NUMBER[i].count
                timer=configLength.ROUND_NUMBER[i].timer
            }
           }

        finalquestions=finalquestions.sort((i,j)=>i.displayOrder-j.displayOrder)
        // finalquestions = finalquestions.sort(() => 0.5 - Math.random())
        finalquestions = finalquestions.slice(0,count)
        if (finalquestions) {
            if (Object.keys(finalquestions).length !== 0) {
                res.status(200).json({
                    isValid: true,
                    message: 'Success',
                    finalquestions: finalquestions,
                    timer:timer

                })

            }
            else {
                res.status(201).json({
                    isValid: false,
                    message: 'No data found.'
                })
            }
        }
        else {
            res.status(433).json({
                isSuccessful: false,
                err: err.message,
                message: "Unable to get data."
            })
        }
    })


module.exports = router