/**
 * Created by Majid on 12/30/2014.
 */

var express = require('express');
var router = express.Router();
var moment = require('moment');
var datejs = require('safe_datejs');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var HttpStatus = require('http-status-codes');
var ApplicationModel = require('../model/ScoreModel').ApplicationModel;
var ScoreModel = require('../model/ScoreModel').ScoreModel;
var UserModel = require('../model/ScoreModel').UserModel;

function submitToBoard(req, res){
    try{
        var appId = req.body.appId;
        var appName = req.body.appName;
        var phone = req.body.phone;
        var mime = req.body.mime;
        var name = req.body.name;
        var time = req.body.time;
        var date = req.body.date;
        var errorMessage = "required params : [";
        var hasError = false;
        if(!appName){
            errorMessage += " appName";
            hasError = true;
        }
        if(!appId){
            errorMessage += " appId";
            hasError = true;
        }
        if(!time){
            errorMessage += " time"
            hasError = true;
        }
        if(!date){
            errorMessage += " date";
            hasError = true;
        }
        if(!phone){
            errorMessage += " phone"
            hasError = true;
        }
        if(!mime){
            errorMessage += " mime";
            hasError = true;
        }
        if(!name){
            errorMessage += " name";
            hasError = true;
        }
        if(hasError){
            errorMessage += " ]"
            res.send(errorMessage, HttpStatus.BAD_REQUEST);
        }
        else{
            ApplicationModel.findOne({'_id': appId}).exec(function(err, app){
                if(err){
                    res.send(err, HttpStatus.BAD_REQUEST);
                }
                else if(!app){
                    res.send("Entity Not Found", HttpStatus.UNPROCESSABLE_ENTITY);
                }
                else{
                    UserModel.findOne({PhoneNumber: phone}).exec(function(err2, user){
                        if(err2){
                            res.send(err2, HttpStatus.BAD_REQUEST);
                        }
                        else if(!user){
                            var newUser = new UserModel({
                                PhoneNumber : phone,
                                MIME : mime,
                                Name : name,
                                CreateDate : (new Date()).AsDateJs()
                            });
                            newUser.save(null);
                            var newScore = new ScoreModel({
                                Application: app.id,
                                User: newUser.id,
                                Score: score,
                                SubmitDate: (new Date()).AsDateJs()
                            });
                            newScore.save(null);
                            newUser.Score = newScore.id;
                            newUser.save(null);
                            res.json(newUser);
                        }
                        else{
                            ScoreModel.findOne({User:user.id}).exec(function(err3, scr){
                                if(err3){
                                    res.send(err3, HttpStatus.BAD_REQUEST);
                                }
                                else if(!scr){
                                    var newScore = new ScoreModel({
                                        Application: app.id,
                                        User: user.id,
                                        Score: score,
                                        SubmitDate: (new Date()).AsDateJs()
                                    });
                                    newScore.save(null);
                                    user.Score = newScore.id;
                                    user.save(null);
                                    res.json(user);
                                }
                                else{
                                    scr.Score = score;
                                    scr.SubmitDate = (new Date()).AsDateJs();
                                    scr.save(null);
                                    res.json(user);
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    catch(ex){
        console.log(ex);
        res.send(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

function getLatestBoard(req, res){
    try{
        var type = req.params.type;
        var appId = req.params.appId;
        var count = req.params.count;
        ApplicationModel.findOne({'_id': appId}).exec(function(err, app){
            if(err){
                res.send(err, HttpStatus.BAD_REQUEST);
            }
            else if(!app){
                res.send("Entity Not Found", HttpStatus.UNPROCESSABLE_ENTITY);
            }
            else{
                ScoreModel.find({Application:appId}).populate('User').exec(function(err, scores){
                    if(err){
                        res.send(err, HttpStatus.BAD_REQUEST);
                    }
                    else if(!scores){
                        res.send("Entity Not Found", HttpStatus.UNPROCESSABLE_ENTITY);
                    }
                    else{
                        res.json(scores);
                    }
                });
            }
        });
    }
    catch(ex){
        console.log(ex);
        res.send(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

function getMyRank(req, res){
    try{
        var type = req.params.type;
        var appId = req.params.appId;
        var userId = req.params.userId;
        ApplicationModel.findOne({'_id': appId}).exec(function(err, app){
            if(err){
                res.send(err, HttpStatus.BAD_REQUEST);
            }
            else if(!app){
                res.send("Entity Not Found", HttpStatus.UNPROCESSABLE_ENTITY);
            }
            else{
                ScoreModel.findOne({User:userId}).exec(function(err, scores){
                    if(err){
                        res.send(err, HttpStatus.BAD_REQUEST);
                    }
                    else if(!scores){
                        res.send("Entity Not Found", HttpStatus.UNPROCESSABLE_ENTITY);
                    }
                    else{
                        res.json({score: scores.Score, rank : 1});
                    }
                });
            }
        });
    }
    catch(ex){
        console.log(ex);
        res.send(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

router.route('/submitToBoard').post(submitToBoard);
router.route('/getLatestBoard/:type/:appId/:count').get(getLatestBoard);
router.route('/getMyRank/:userId/:appId/:type').get(getMyRank);

module.exports = router;/**
 * Created by Majid on 12/30/2014.
 */
