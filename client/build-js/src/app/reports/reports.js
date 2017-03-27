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
var http_1 = require("@angular/http");
var settings_1 = require("../settings/settings");
var app = require("../app");
require("rxjs/add/operator/map");
var Reports = (function () {
    function Reports(http) {
        this.http = http;
        this.report = undefined;
        this.settings = settings_1.Settings.get();
    }
    Reports.prototype.ngOnInit = function () {
        var today = (new Date()).toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
        $('#fromDate').val(today);
        $('#toDate').val(today);
    };
    Reports.prototype.getIsoDate = function (date) {
        return date.substring(6, 10) + '-' + date.substring(3, 5) + '-' + date.substring(0, 2);
    };
    Reports.prototype.getReport = function () {
        var _this = this;
        this.report = undefined;
        try {
            var fromDate = this.getIsoDate($('#fromDate').val());
            var toDate = this.getIsoDate($('#toDate').val());
            this.http.get(app.nodejsServer + '/bonus/report/basic/' + this.settings.branch + '/' + fromDate + '/' + toDate)
                .map(function (response) { return response.json(); })
                .subscribe(function (response) {
                _this.report = response.register;
            });
        }
        catch (error) { }
    };
    return Reports;
}());
Reports = __decorate([
    core_1.Component({
        selector: 'dr-reports',
        template: require('./reports.html'),
    }),
    __metadata("design:paramtypes", [http_1.Http])
], Reports);
exports.Reports = Reports;
