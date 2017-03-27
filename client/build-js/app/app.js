"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
exports.nodejsServer = '/admin/api';
var MyApp = (function () {
    function MyApp() {
    }
    MyApp.prototype.ngOnInit = function () {
        $.fn.datepicker.defaults.language = "es";
        $.fn.datepicker.defaults.todayHighlight = true;
        $.fn.datepicker.defaults.autoclose = true;
    };
    return MyApp;
}());
MyApp = __decorate([
    core_1.Component({
        selector: 'my-app',
        styleUrls: ['app.css'],
        template: require('./app.html')
    })
], MyApp);
exports.MyApp = MyApp;
