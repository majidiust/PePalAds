/**
 * Created by Majid on 12/30/2014.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Application = new Schema({
    Name: {type: String},
    Key: {type: String},
    CreateDate: {type: Date},
    ExpiredDate: {type: Date},
    Url :{type: String}
});

var Score = new Schema({
    Application : {type: mongoose.Schema.ObjectId, ref:'Application'},
    User: {type: mongoose.Schema.ObjectId, ref:'User'},
    Score : {type: Number},
    SubmitDate : {type: Date}
});

var User =  new Schema({
    PhoneNumber : {type: String},
    MIME : {type: String},
    Name : {type: String},
    CreateDate : {type: Date},
    Score : {type: mongoose.Schema.ObjectId, ref:'Score'}
});

var ScoreModel = mongoose.model('Score', Score);
var UserModel = mongoose.model('User', User);
var ApplicationModel = mongoose.model('Application', Application);

module.exports.ScoreModel = ScoreModel;
module.exports.UserModel = UserModel;
module.exports.ApplicationModel = ApplicationModel;
