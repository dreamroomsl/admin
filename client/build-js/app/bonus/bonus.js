"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var settings_1 = require("../settings/settings");
var bootbox = require("bootbox");
var app = require("../app");
require("rxjs/add/operator/map");
var CryptoJS = require("crypto-js");
var Bonus = (function () {
    function Bonus(http) {
        this.http = http;
        this.statements = [];
        this.searchData = [];
        this.showBalance = false;
        this.showNoExist = false;
        this.showOptions = false;
        this.showOk = false;
        this.formModel = new forms_1.FormGroup({
            'telephone': new forms_1.FormControl(),
            'ticketId': new forms_1.FormControl('', forms_1.Validators.pattern('[0-9]{5}')),
            'name': new forms_1.FormControl(),
        });
        this.balance = 0;
        this.settings = settings_1.Settings.get();
    }
    Bonus.prototype.getSecurityToken = function (data) {
        console.log('Data to encrypt=' + data);
        var key = CryptoJS.enc.Utf8.parse(this.settings.securityKey);
        var iv = CryptoJS.enc.Utf8.parse(this.settings.securityKey);
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        console.log('Data encrypted=' + encrypted.toString(CryptoJS.enc.Utf8));
        return "" + encrypted;
    };
    Bonus.prototype.sendAction = function (minutes, cash) {
        var _this = this;
        var bonus = {
            telephone: this.formModel.value.telephone,
            branch: this.settings.branch,
            name: this.formModel.value.name || '',
            ticketId: this.formModel.value.ticketId || '',
            securityToken: this.getSecurityToken(this.formModel.value.ticketId + this.settings.branch + this.statements.length),
        };
        if (minutes != 0) {
            bonus.minutes = minutes;
        }
        if (cash != 0) {
            bonus.cash = cash;
        }
        this.http.post(app.nodejsServer + '/bonus/', bonus)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log('Data=' + JSON.stringify(response, undefined, 2));
            if (response.error == true) {
                console.log("ERROR!!");
                bootbox.alert('No se ha podido actualizar la información. <strong>' + response.message + '</strong>');
            }
            else {
                _this.showOk = true;
                setTimeout(function () { _this.showOk = false; }, 500);
                _this.searchBonus();
            }
        });
    };
    Bonus.prototype.duplicateBonus = function (minutes, cash) {
        var _this = this;
        this.http.get(app.nodejsServer + '/nextbonus/' + this.settings.branch)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            _this.formModel.patchValue({
                ticketId: response.next,
            });
            _this.statements = [];
            _this.sendAction(minutes, cash);
        });
    };
    Bonus.prototype.clearFields = function () {
        this.formModel.reset();
        this.balance = 0;
        this.showNoExist = false;
        this.showBalance = false;
        this.showOptions = false;
        this.statements = [];
        this.searchData = [];
    };
    Bonus.prototype.searchByName = function () {
        var _this = this;
        if (Number(this.formModel.value.ticketId) != 0) {
            return;
        }
        var name = this.formModel.value.name;
        this.http.get(app.nodejsServer + '/bonusbyname/' + this.settings.branch + '/' + name)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            if (!response.error) {
                _this.searchData = response.register;
            }
        });
    };
    Bonus.prototype.searchByTelephone = function () {
        var _this = this;
        if (Number(this.formModel.value.ticketId) != 0) {
            return;
        }
        var telephone = this.formModel.value.telephone;
        this.http.get(app.nodejsServer + '/bonusbytelephone/' + this.settings.branch + '/' + telephone)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            if (!response.error) {
                _this.searchData = response.register;
            }
        });
    };
    Bonus.prototype.searchByTicketId = function (ticketId) {
        this.formModel.patchValue({
            ticketId: ticketId,
        });
        this.searchBonus();
    };
    Bonus.prototype.searchNextBonusId = function () {
        var _this = this;
        this.http.get(app.nodejsServer + '/nextbonus/' + this.settings.branch)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            _this.formModel.patchValue({
                ticketId: response.next,
            });
            _this.searchBonus();
        });
    };
    Bonus.prototype.searchBonus = function () {
        var _this = this;
        var ticketId = this.formModel.value.ticketId;
        console.log('searchSubmit:' + ticketId);
        if (isNaN(Number(ticketId))) {
            ticketId = undefined;
        }
        if (ticketId == undefined || ticketId.length == 0) {
            this.searchNextBonusId();
        }
        this.http.get(app.nodejsServer + '/bonus/' + this.settings.branch + '/' + ticketId)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log('Data=' + JSON.stringify(response, undefined, 2));
            if (response.error == true) {
                console.log("ERROR!!");
                _this.clearFields();
                _this.formModel.patchValue({
                    ticketId: ticketId,
                });
                _this.showNoExist = true;
                _this.showBalance = false;
                _this.statements = [];
            }
            else {
                _this.formModel.patchValue({
                    name: response.register.data.name,
                    telephone: response.register.data.telephone,
                });
                _this.balance = response.register.balance;
                _this.statements = response.register.data.statements || [];
                _this.showNoExist = false;
                _this.showBalance = true;
                _this.statements.sort(function (a, b) {
                    var date1 = new Date(a.date);
                    var date2 = new Date(b.date);
                    return date2.getTime() - date1.getTime();
                });
            }
            if (Number(ticketId) >= 1) {
                if (_this.settings.branch != undefined &&
                    _this.settings.branch.length == 3 &&
                    _this.settings.securityKey != undefined &&
                    _this.settings.securityKey.length == 16) {
                    _this.showOptions = true;
                }
            }
            else {
                _this.showOptions = false;
            }
        });
        $('#name').focus();
    };
    return Bonus;
}());
Bonus = __decorate([
    core_1.Component({
        selector: 'dr-bonus',
        template: require('./bonus.html'),
    }),
    __metadata("design:paramtypes", [http_1.Http])
], Bonus);
exports.Bonus = Bonus;
