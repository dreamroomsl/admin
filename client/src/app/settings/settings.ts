import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as CryptoJS from 'crypto-js';

export interface SettingsInfo {
  branch?         : string,
  securityKey?    : string,
  workstations?   : number,
}

@Component({
  selector: 'dr-settings',
  template: require('./settings.html'),
})
export class Settings {

  formModel: FormGroup;

  public static get() : SettingsInfo {
    let settings : any = localStorage.getItem("settings");

    return <SettingsInfo> JSON.parse(settings);
  }

  constructor(private http: Http) {
    this.formModel = new FormGroup({
      'branch'        : new FormControl(),
      'securityKey'   : new FormControl(),
      'workstations'  : new FormControl(),
    });

    this.refreshData();
  }

  refreshData() {
    let settings = Settings.get();

    if (settings != undefined && settings.branch != undefined) {
      this.formModel.patchValue({
        branch        : settings.branch,
        securityKey   : settings.securityKey == undefined ? '' : '****************',
        workstations  : "" + ((settings.workstations == undefined) ? 0 : settings.workstations),
      });
    }
  }

  onSubmit() {
    console.log('OnSubmit:');

    let securityKey = this.formModel.value.securityKey;

    let settings = {
      branch        : this.formModel.value.branch,
      securityKey   : securityKey.charAt(0) == '*' ? Settings.get().securityKey : this.formModel.value.securityKey,
      workstations  : parseInt(this.formModel.value.workstations),
    };
    localStorage.setItem("settings", JSON.stringify(settings));
    this.refreshData();
  }
}
