const express = require('express');
const router = express.Router();
const db = require('./../../database/models');
const VISITOR = db.visitorCount;
const DISTRICT = db.district
const NodeCache = require('node-cache');

const _cache = new NodeCache({stdTTL: 0});

router

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

    .post('/updateVisitor', async (req, res) => {
        const _totlPageVisitors = 'totlPageVisitors';
        console.log(req.body)
        let existingCount = await VISITOR.findOne({ where: { id: req.body.id } })
        if (existingCount) {
            let count = existingCount.count + req.body.count
            VISITOR.update({ count: count }, { where: { id: existingCount.id } })
                .then((result) => {
                    _cache.set(_totlPageVisitors, count);
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