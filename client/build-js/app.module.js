"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
const platform_browser_1 = require("@angular/platform-browser");
const forms_1 = require("@angular/forms");
const core_2 = require("@angular/core");
const app_routing_1 = require("./app.routing");
const app_1 = require("./app/app");
const about_1 = require("./app/about/about");
const bonus_1 = require("./app/bonus/bonus");
const home_1 = require("./app/home/home");
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, http_1.HttpModule, app_routing_1.ROUTING, forms_1.FormsModule, forms_1.ReactiveFormsModule],
        providers: [
            { provide: core_2.LOCALE_ID, useValue: "es-ES" }
        ],
        declarations: [app_1.MyApp, about_1.About, home_1.Home, bonus_1.Bonus],
        bootstrap: [app_1.MyApp]
    })
], AppModule);
exports.AppModule = AppModule;
