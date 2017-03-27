"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var core_2 = require("@angular/core");
var app_routing_1 = require("./app.routing");
var app_1 = require("./app/app");
var settings_1 = require("./app/settings/settings");
var bonus_1 = require("./app/bonus/bonus");
var reports_1 = require("./app/reports/reports");
var home_1 = require("./app/home/home");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, http_1.HttpModule, app_routing_1.ROUTING, forms_1.FormsModule, forms_1.ReactiveFormsModule],
        providers: [
            { provide: core_2.LOCALE_ID, useValue: "es-ES" }
        ],
        declarations: [app_1.MyApp, home_1.Home, bonus_1.Bonus, settings_1.Settings, reports_1.Reports],
        bootstrap: [app_1.MyApp]
    })
], AppModule);
exports.AppModule = AppModule;
