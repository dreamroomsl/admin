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
var settings_1 = require("../settings/settings");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var app = require("../app");
var Timers = (function () {
    function Timers(http) {
        var _this = this;
        this.http = http;
        this.timers = new Array();
        this.settings = settings_1.Settings.get();
        this.http.get(app.nodejsServer + '/timers/' + this.settings.branch)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log('Data=' + JSON.stringify(response, undefined, 2));
            for (var i = 1; i <= _this.settings.workstations; i++) {
                var ti = { id: i, installed: response.timers.includes("" + i) };
                _this.timers.push(ti);
            }
        });
    }
    Timers.prototype.executeAction = function (timer, action, seconds) {
        var _this = this;
        console.log("timer=" + timer);
        seconds++;
        this.http.put(app.nodejsServer + '/timer/' + this.settings.branch + '/' + timer + '?action=' + action + '&seconds=' + seconds, undefined)
            .map(function (response) { return response.json(); })
            .subscribe(function (response) {
            console.log(JSON.stringify(response, undefined, 2));
            if (response.error) {
                console.log('Error!');
                $('#timer' + timer).addClass('btn-danger');
            }
            if (response.seconds != undefined) {
                _this.timers.forEach(function (ti) {
                    if (ti.id == timer) {
                        var minutes = Math.abs(Math.trunc(parseInt(response.seconds) / 60));
                        var seconds_1 = Math.abs(Math.trunc(parseInt(response.seconds) % 60));
                        ti.seconds = '' + (parseInt(response.seconds) < 0 ? '-' : '') + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds_1 < 10 ? "0" : "") + seconds_1;
                        setTimeout(function () {
                            ti.seconds = undefined;
                        }, 3000);
                    }
                });
            }
        });
    };
    return Timers;
}());
Timers = __decorate([
    core_1.Component({
        selector: 'dr-timers',
        template: require('./timers.html'),
    }),
    __metadata("design:paramtypes", [http_1.Http])
], Timers);
exports.Timers = Timers;
