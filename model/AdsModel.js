/**
 * New node file
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Define our user schema
var Contact = new Schema({
    Name : {type: String},
    Value : {type: String}
});

var MoneyTransaction = new Schema({
    ReferencedCode :{type: String},
    Date : { type: Date},
    Amount: {type: String},
    BankId: {type: String},
    InternalReference: {type: String},
    ResultCode: {type: String}
});

var Producer = new Schema({
   Name : {type:String},
   Contacts : [Contact],
   Credit : {type: String},
   Payments : [MoneyTransaction]
});

var Ads = new Schema({
    Name: {type:String},
    CreateDate : {type: Date},
    ExpirationDate : {type: Date},
    Hint : {type: Number},
    Logo : {type: String},
    WallPaper : {type: String},
    Link : {type: String},
    Duration : {type: String},
    Video : {type: String},
    Producer : [{type: mongoose.Schema.ObjectId, ref:'Producer'}]
});

var AdsModel = mongoose.model('Ads', Ads);
var ProducerModel = mongoose.model('Producer', Producer);
module.exports.AdsModel = AdsModel;
module.exports.ProducerModel = ProducerModel;