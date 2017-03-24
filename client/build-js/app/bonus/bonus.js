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
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const http_1 = require("@angular/http");
const settings_1 = require("../settings/settings");
const bootbox = require("bootbox");
const app = require("../app");
require("rxjs/add/operator/map");
const CryptoJS = require("crypto-js");
let Bonus = class Bonus {
    constructor(http) {
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
    getSecurityToken(data) {
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
    }
    sendAction(minutes, cash) {
        let bonus = {
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
            .map(response => response.json())
            .subscribe(response => {
            console.log('Data=' + JSON.stringify(response, undefined, 2));
            if (response.error == true) {
                console.log("ERROR!!");
                bootbox.alert('No se ha podido actualizar la información. <strong>' + response.message + '</strong>');
            }
            else {
                this.showOk = true;
                setTimeout(() => { this.showOk = false; }, 500);
                this.searchBonus();
            }
        });
    }
    clearFields() {
        this.formModel.reset();
        this.balance = 0;
        this.showNoExist = false;
        this.showBalance = false;
        this.showOptions = false;
        this.statements = [];
        this.searchData = [];
    }
    searchByName() {
        if (Number(this.formModel.value.ticketId) != 0) {
            return;
        }
        let name = this.formModel.value.name;
        this.http.get(app.nodejsServer + '/bonusbyname/' + this.settings.branch + '/' + name)
            .map(response => response.json())
            .subscribe(response => {
            if (!response.error) {
                this.searchData = response.register;
            }
        });
    }
    searchByTelephone() {
        if (Number(this.formModel.value.ticketId) != 0) {
            return;
        }
        let telephone = this.formModel.value.telephone;
        this.http.get(app.nodejsServer + '/bonusbytelephone/' + this.settings.branch + '/' + telephone)
            .map(response => response.json())
            .subscribe(response => {
            if (!response.error) {
                this.searchData = response.register;
            }
        });
    }
    searchByTicketId(ticketId) {
        this.formModel.patchValue({
            ticketId: ticketId,
        });
        this.searchBonus();
    }
    searchNextBonusId() {
        this.http.get(app.nodejsServer + '/nextbonus/' + this.settings.branch)
            .map(response => response.json())
            .subscribe(response => {
            this.formModel.patchValue({
                ticketId: response.next,
            });
            this.searchBonus();
        });
    }
    searchBonus() {
        let ticketId = this.formModel.value.ticketId;
        console.log('searchSubmit:' + ticketId);
        if (isNaN(Number(ticketId))) {
            ticketId = undefined;
        }
        if (ticketId == undefined || ticketId.length == 0) {
            this.searchNextBonusId();
        }
        this.http.get(app.nodejsServer + '/bonus/' + this.settings.branch + '/' + ticketId)
            .map(response => response.json())
            .subscribe(response => {
            console.log('Data=' + JSON.stringify(response, undefined, 2));
            if (response.error == true) {
                console.log("ERROR!!");
                this.clearFields();
                this.formModel.patchValue({
                    ticketId: ticketId,
                });
                this.showNoExist = true;
                this.showBalance = false;
                this.statements = [];
            }
            else {
                this.formModel.patchValue({
                    name: response.register.data.name,
                    telephone: response.register.data.telephone,
                });
                this.balance = response.register.balance;
                this.statements = response.register.data.statements || [];
                this.showNoExist = false;
                this.showBalance = true;
                this.statements.sort((a, b) => {
                    let date1 = new Date(a.date);
                    let date2 = new Date(b.date);
                    return date2.getTime() - date1.getTime();
                });
            }
            if (Number(ticketId) >= 1) {
                if (this.settings.branch != undefined &&
                    this.settings.branch.length == 3 &&
                    this.settings.securityKey != undefined &&
                    this.settings.securityKey.length == 16) {
                    this.showOptions = true;
                }
            }
            else {
                this.showOptions = false;
            }
        });
        $('#name').focus();
    }
};
Bonus = __decorate([
    core_1.Component({
        selector: 'dr-bonus',
        templateUrl: 'bonus.html',
    }),
    __metadata("design:paramtypes", [http_1.Http])
], Bonus);
exports.Bonus = Bonus;
