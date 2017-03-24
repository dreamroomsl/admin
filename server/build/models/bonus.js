'use strict';
var mongoose = require("mongoose");
var bonusSchema = mongoose.Schema({
    telephone: String,
    name: String,
    ticketId: Number,
    branch: String,
    statements: [{
            date: { type: Date, default: Date.now },
            cash: Number,
            minutes: Number
        }],
});
module.exports = mongoose.model('bonus', bonusSchema);
