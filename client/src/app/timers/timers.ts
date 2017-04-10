import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {Settings, SettingsInfo } from '../settings/settings';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as CryptoJS from 'crypto-js';
import * as app     from '../app'

interface CounterInfo {
  seconds : number;
  running : boolean;
}

interface TimerInfo {
  id        : number;
  installed : boolean;
}

@Component({
  selector: 'dr-timers',
  template: require('./timers.html'),
})
export class Timers {

  settings    : SettingsInfo;
  timers      : any = new Array<TimerInfo>();

  constructor(private http: Http) {
    this.settings = Settings.get();

    this.http.get(app.nodejsServer + '/timers/' + this.settings.branch)
    .map(response => response.json())
    .subscribe(response => {
      console.log('Data=' + JSON.stringify(response, undefined, 2));

      for (let i = 1; i <= this.settings.workstations; i++) {
        let ti : TimerInfo = {id : i, installed : response.timers.includes("" + i)};

        this.timers.push(ti);
      }
    });
  }

  executeAction(timer : string, action : string, minutes : number) {
    console.log("timer=" + timer);

    let seconds = ((minutes * 60) + 1);

    this.http.put(app.nodejsServer + '/timer/' + this.settings.branch + '/' + timer + '?action=' + action + '&seconds=' + seconds, undefined)
    .map(response => response.json())
    .subscribe(response => {
      console.log(JSON.stringify(response, undefined, 2));
      if (response.error) {
        console.log('Error!');
        $('#timer' + timer).addClass('btn-danger')
      }
    });

  }
}
