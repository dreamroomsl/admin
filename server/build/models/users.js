'use strict';
var mongoose = require("mongoose");
var userSchema = mongoose.Schema({
    email: String,
    password: String,
    phone: String
});
module.exports = mongoose.model('users', userSchema);
;
