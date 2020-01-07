const express = require('express');
const bodyParser = require ("body-parser");
const mongoose = require('mongoose')
const promoRouter = express.Router();

const Promotions = require('../models/promotions')

promoRouter.use(bodyParser.json())
/////////////////////////////for all promotions////////////////////////
promoRouter.route('/')
                    .get((req,res, next) => {
                        Promotions.find({}).exec()
                        .then((promo) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(promo);
                        }, (err) => next(err))
                        .catch((err) => next(err))
                    }).post((req,res, next) => {
                        Promotions.create(req.body)
                        .then((promo) => {
                            console.log('Promotion created',promo);     
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(promo);
                        }, (err) => next(err))
                        .catch((err) => next(err))
                    }).put((req,res,next) => {
                        res.statusCode = 403;
                        res.end('PUT operation not supported on Promotions')
                    }).delete((req,res,next) => {
                        Promotions.remove({})
                        .then((resp) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(resp);
                        } , (err) => next(err))
                        .catch((err) => next(err))
                    })

// ////////////////////////For Specific promotions//////////////////////////////
promoRouter.route('/:promoOld')
                            .get((req,res,next) => {
                             Promotions.findById(req.params.promoOld)
                             .then((promo) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(promo)
                             },(err) => next(err))
                             .catch((err) => next(err))
                            }).post((req,res,next) => {
                                res.statusCode = 403;
                                res.end('POST operation not supported on /promotions/'+
                                    req.params.dishId)
                            }).put((req,res,next) => {
                                Promotions.findByIdAndUpdate(req.params.promoOld, {
                                    $set:req.body
                                }, {new :true})
                                .then((promo) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(promo)
                                }, (err) => next(err))
                                .catch((err) => next(err))
                            }).delete((req,res,next ) => {
                                Promotions.findByIdAndRemove(req.params.promoOld)
                                .then((resp) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(resp)
                                }, (err) => next(err))
                                .catch((err) => next(err))
                            })

module.exports = promoRouter