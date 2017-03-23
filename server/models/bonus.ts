//var mongoose    =   require("mongoose");
'use strict';

declare const require : any;
declare const module  : any;

//import mongoose as mn from("mongoose");
var mongoose = require("mongoose");

var bonusSchema  = mongoose.Schema({
    telephone : String,
    name : String,
    ticketId: Number,
    branch: String,
    statements: [{
      date: { type: Date, default: Date.now },
      cash: Number,
      minutes: Number
    }],
});
// create model if not exists.
module.exports = mongoose.model('bonus',bonusSchema);
