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
var AdsModel = require('../model/AdsModel').AdsModel;
var ProducerModel = require('../model/AdsModel').ProducerModel;
/*----------------------------------- Uploader module ------------------------*/
var options;
options = {
    tmpDir: __dirname + '/../public/uploaded/tmp',
    uploadDir: __dirname + '/../public/uploaded/files',
    uploadUrl: '/uploaded/files/',
    maxPostSize: 11000000000, // 11 GB
    minFileSize: 1,
    maxFileSize: 10000000000, // 10 GB
    acceptFileTypes: /.+/i,
    // Files not matched by this regular expression force a download dialog,
    // to prevent executing any scripts in the context of the service domain:
    inlineFileTypes: /\.(gif|jpe?g|png)/i,
    imageTypes: /\.(gif|jpe?g|png)/i,
    imageVersions: {
        width: 80,
        height: 80
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
    }
};

// init the uploader
var uploader = require('blueimp-file-upload-expressjs')(options);


function getAds(req, res){
    try{
        var deviceId = req.body.deviceId;
        var time = req.body.time;
        var date = req.body.date;
        var appId = req.body.appId;
        var errorMessage = "required params : [";
        var hasError = false;
        if(!appId){
            errorMessage += " appId";
            hasError = true;
        }
        if(!deviceId){
            errorMessage += " deviceId";
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
        if(hasError){
            errorMessage += " ]"
            res.send(errorMessage, HttpStatus.BAD_REQUEST);
        }
        else{
            var producer = new ProducerModel({
                Name : "Kaveh"
            });
            producer.save(null);

            var result = new AdsModel({
                Name : 'BlurKaveh',
                CreateDate : (new Date()).AsDateJs(),
                ExpirationDate : (new Date()).AsDateJs(),
                Hint : 120,
                Logo : 'logo.png',
                WallPaper : 'wallPaper.png',
                Link : 'http://pepal.ir',
                Duration : '3600',
                Video : 'video.mp4'
            });

            result.save(null);
            result.Producer = producer.id;
            result.save(null);
            res.json(result);
        }
    }
    catch(ex){
        console.log(ex);
        res.send(ex, 500);
    }
}
router.route('/getAds').post(getAds);


module.exports = router;