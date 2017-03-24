"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@angular/router");
const home_1 = require("./app/home/home");
const settings_1 = require("./app/settings/settings");
const bonus_1 = require("./app/bonus/bonus");
exports.ROUTES = [
    { path: '', component: home_1.Home },
    { path: 'settings', component: settings_1.Settings },
    { path: 'bonus', component: bonus_1.Bonus }
];
exports.ROUTING = router_1.RouterModule.forRoot(exports.ROUTES);
