"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var home_1 = require("./app/home/home");
var settings_1 = require("./app/settings/settings");
var bonus_1 = require("./app/bonus/bonus");
var reports_1 = require("./app/reports/reports");
exports.ROUTES = [
    { path: '', component: home_1.Home },
    { path: 'settings', component: settings_1.Settings },
    { path: 'bonus', component: bonus_1.Bonus },
    { path: 'reports', component: reports_1.Reports }
];
exports.ROUTING = router_1.RouterModule.forRoot(exports.ROUTES);
