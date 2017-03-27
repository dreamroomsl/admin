import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import {Http } from '@angular/http';
import {Settings, SettingsInfo } from '../settings/settings';
import * as bootbox from 'bootbox';
import * as app     from '../app'
import 'rxjs/add/operator/map';
import * as CryptoJS from 'crypto-js';

// TO DO: avoid using jquery. boostrap datapicker problems using angular2 input binding

@Component({
  selector: 'dr-reports',
  template: require('./reports.html'),
})
export class Reports implements OnInit {

  settings : SettingsInfo;
  report   : any = undefined;

  constructor(private http: Http) {
    this.settings = Settings.get();
  }

  ngOnInit() {
    let today = (new Date()).toLocaleString('es-ES', {year : 'numeric', month : '2-digit', day : '2-digit'});

    $('#fromDate').val(today);
    $('#toDate').val(today)
  }

  getIsoDate(date : string) {
    return date.substring(6, 10) + '-' + date.substring(3, 5) + '-' + date.substring(0, 2);
  }

  getReport() {
    this.report = undefined;

    try {
      let fromDate = this.getIsoDate($('#fromDate').val());
      let toDate   = this.getIsoDate($('#toDate').val());

      this.http.get(app.nodejsServer + '/bonus/report/basic/' + this.settings.branch + '/' + fromDate + '/' + toDate)
      .map(response => response.json())
      .subscribe(response => {
        this.report = response.register;
      });
    } catch(error) {}
  }
}
