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
require("rxjs/add/operator/map");
let Settings = Settings_1 = class Settings {
    constructor(http) {
        this.http = http;
        this.formModel = new forms_1.FormGroup({
            'branch': new forms_1.FormControl(),
            'securityKey': new forms_1.FormControl(),
        });
        this.refreshData();
    }
    static get() {
        let settings = localStorage.getItem("settings");
        return JSON.parse(settings);
    }
    refreshData() {
        let settings = Settings_1.get();
        if (settings.branch != undefined) {
            this.formModel.patchValue({
                branch: settings.branch,
                securityKey: settings.securityKey == undefined ? '' : '****************',
            });
        }
    }
    onSubmit() {
        console.log('OnSubmit:');
        let securityKey = this.formModel.value.securityKey;
        if (securityKey.charAt(0) != '*') {
            let settings = {
                branch: this.formModel.value.branch,
                securityKey: this.formModel.value.securityKey,
            };
            localStorage.setItem("settings", JSON.stringify(settings));
            this.refreshData();
        }
    }
};
Settings = Settings_1 = __decorate([
    core_1.Component({
        selector: 'dr-settings',
        templateUrl: 'settings.html',
    }),
    __metadata("design:paramtypes", [http_1.Http])
], Settings);
exports.Settings = Settings;
var Settings_1;
