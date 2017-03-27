'use strict';

/*
Starting server in MAC

cd $mongodb/bin
./mongod --dbpath /Users/$username/mongodb/db

Starting client (if needed)
./mongo
*/
import * as CryptoJS from 'crypto-js';

var express    = require("express");
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");

var mongoUsers = require("./models/users");
var mongoBonus = require("./models/bonus");

var app         =   express();
var router      =   express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

mongoose.connect('mongodb://localhost:27017/dream_room');

router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Hello World"});
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// USERS
router.route("/users")
  .get(function(req,res) {
    var response = {};
    mongoUsers.find({},function(err,data){
      if (err || data == null) {
        response = {"error" : true, "message" : "Error fetching data"};
      } else {
        response = {"error" : false, "message" : data};
      }
      res.json(response);
    })
  })
  .post(function(req,res){
    var user       = new mongoUsers();
    var response = {};

    user.password = req.body.password;
    user.phone    = req.body.phone;

    user.save(function(err){
      if (err) {
        response = {"error" : true, "message" : "Error adding data"};
      } else {
        response = {"error" : false, "message" : "Data added"};
      }
      res.json(response);
    });
  });

  router.route("/bonus")
    .get(function(req,res){
      var response = {};
      mongoBonus.find({},function(err,data){
        if (err || data == null) {
          response = {"error" : true, "message" : "Error fetching data"};
        } else {
          response = {"error" : false, "register" : data};
        }
        res.json(response);
      })
    })
    .post(function(req,res){

      var response = {};
      var bonus    = new mongoBonus();

      console.log("ticketId=" + req.body.ticketId);

      mongoBonus.findOne({ticketId:req.body.ticketId, branch:req.body.branch},function(err,data){

        if (!err && data != null) {
          bonus = data;
        }

        let key = CryptoJS.enc.Utf8.parse('3057839563934' + req.body.branch);
        let iv  = CryptoJS.enc.Utf8.parse('3057839563934' + req.body.branch);

        var decrypted = CryptoJS.AES.decrypt(req.body.securityToken, key,
                        {
                            keySize: 128 / 8,
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7
                        });

        console.log('SecurityToken=' + req.body.securityToken);
        console.log('Decrypted=' + decrypted.toString(CryptoJS.enc.Utf8));

        let totalStatements = 0;

        if (bonus.statements != undefined) {
          totalStatements = bonus.statements.length;
        }

        let resultExpected = req.body.ticketId + req.body.branch + totalStatements;
        console.log('resultExpected=' + resultExpected);

        if (decrypted.toString(CryptoJS.enc.Utf8) == resultExpected) {
          console.log('OK');
          bonus.telephone    = req.body.telephone;
          bonus.name         = req.body.name;
          bonus.ticketId     = req.body.ticketId;
          bonus.branch       = req.body.branch;

          if (req.body.cash != undefined && req.body.cash != 0) {
            bonus.statements.push({cash:req.body.cash});
          }
          if (req.body.minutes != undefined && req.body.minutes != 0) {
            bonus.statements.push({minutes:req.body.minutes});
          }

          bonus.save(function(err){
            if (err) {
              response = {"error" : true, "message" : "Error actualizando datos"};
            } else {
              response = {"error" : false, "message" : "Datos modificados"};
            }
            res.json(response);
          });
        } else {
          console.log('ERROR!');

          response = {"error" : true, "message" : "Error en el token de seguridad. Revisar oficina y clave de seguridad."};
          res.json(response);
        }
      })
    });

    router.route("/nextbonus/:branch")
      .get(function(req,res){
        var response = {};
        mongoBonus.findOne({branch:req.params.branch}).sort('-ticketId').exec(function(err,data){
          if (err || data == null) {
            response = {"error" : false, "next" : "1"};
          } else {
            response = {"error" : false, "next" : "" + (Number(data.ticketId) + 1)};
          }
          res.json(response);
        })
      })

    router.route("/bonusbyname/:branch/:name")
      .get(function(req,res){
        var response = {};
        mongoBonus.find({branch:req.params.branch, name : new RegExp(req.params.name,'i')}).sort('-ticketId').exec(function(err,data){
          if (err || data == null) {
            response = {"error" : true, "message" : "Registro no encontrado"};
          } else {
            response = {"error" : false, "register" : data};
          }
          res.json(response);
        })
      })

      router.route("/bonusbytelephone/:branch/:telephone")
        .get(function(req,res){
          var response = {};
          mongoBonus.find({branch:req.params.branch, telephone : new RegExp(req.params.telephone,'i')}).sort('-ticketId').exec(function(err,data){
            if (err || data == null) {
              response = {"error" : true, "message" : "Registro no encontrado"};
            } else {
              response = {"error" : false, "register" : data};
            }
            res.json(response);
          })
        })

    router.route("/bonus/:branch/:ticketId")
      .get(function(req,res){

        console.log("branch=" + req.params.branch + ",ticketId=" + req.params.ticketId);

        var response = {};
        mongoBonus.findOne({ticketId:Number(req.params.ticketId), branch:req.params.branch},function(err,data){
          if (err || data == null) {
            response = {"error" : true, "message" : "Registro no encontrado"};
            res.json(response);
          } else {
            mongoBonus.aggregate([
              { $match: {
                ticketId: Number(req.params.ticketId),
              }},
              { $match: {
                branch   : req.params.branch,
              }},
              { $unwind: "$statements" },
              { $group: {
                _id : "$ticketId",
                balance: { $sum: "$statements.minutes"  }
              }}
            ], function (err, result) {
              var balance = 0;

              if (!err && result.length != 0) {
                balance = result[0].balance;
              }
              response = {"error" : false, "register" : {data, balance : balance}};
              res.json(response);
            });
          }
        })
      });

router.route("/bonus/report/basic/:branch/:fromDate/:toDate")
  .get(function(req,res) {
    console.log("Report Basic Branch=" + req.params.branch);

    var response = {};

    var fromDate = {$gte: [ "$statements.date", new Date(req.params.fromDate + "T00:00:00.0Z")]};
    var toDate   = {$lte: [ "$statements.date", new Date(req.params.toDate   + "T23:59:59.999Z")]}

    mongoBonus.aggregate([
      { $match: {
        branch   : req.params.branch,
      }},
      { $unwind: "$statements" },
      { $group: {
        _id : "$branch",
        minutesConsumed : {
          $sum : {
            $cond: {
              if: { $and : [
                      {$lt: [ "$statements.minutes", 0 ]},
                      fromDate,
                      toDate,
                    ]
                  },
                  then: "$statements.minutes",
                  else: 0
            }
          }
        },
        minutesBought : {
          $sum : {
            $cond: {
              if: { $and : [
                      {$gt: [ "$statements.minutes", 0 ]},
                      fromDate,
                      toDate,
                    ]
                  },
                  then: "$statements.minutes",
                  else: 0
            }
          }
        },
        cashPaid : {
          $sum : {
            $cond: { //2017-03-21T23:09:02.801Z
              if: { $and : [
                      {$gt:  [ "$statements.cash", 0 ]},
                      fromDate,
                      toDate,
                    ]
                   },
                   then: "$statements.cash",
                   else: 0
            }
          }
        },
        cashRefunded : {
          $sum : {
            $cond: {
              if: { $and : [
                      {$lt: [ "$statements.cash", 0 ]},
                      fromDate,
                      toDate,
                    ]
                  },
                  then: "$statements.cash",
                  else: 0
            }
          }
        },
      }}
    ], function (err, result) {
      var minutesConsumed = 0;
      var minutesBought   = 0;
      var cashPaid        = 0;
      var cashRefunded    = 0;

      if (!err && result.length != 0) {
        minutesBought   =  result[0].minutesBought;
        minutesConsumed = -result[0].minutesConsumed;
        cashPaid        =  result[0].cashPaid;
        cashRefunded    = -result[0].cashRefunded;
      }
      response = {"error" : false, "register" : {cashPaid : cashPaid, cashRefunded : cashRefunded, minutesConsumed : minutesConsumed, minutesBought : minutesBought}};
      res.json(response);
    });
  });

app.use('/',router);

//app.listen(3000, '192.168.1.35');
app.listen(3000);
console.log("Listening to PORT 3000");
