import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as CryptoJS from 'crypto-js';

export interface SettingsInfo {
  branch?      : string,
  securityKey? : string,
}

@Component({
  selector    : 'dr-settings',
  templateUrl : 'settings.html',
})
export class Settings {

  formModel: FormGroup;

  public static get() : SettingsInfo {
    let settings : any = localStorage.getItem("settings");

    return <SettingsInfo> JSON.parse(settings);
  }

  constructor(private http: Http) {
    this.formModel = new FormGroup({
      'branch'      : new FormControl(),
      'securityKey' : new FormControl(),
    });

    this.refreshData();
  }

  refreshData() {
    let settings = Settings.get();

    if (settings.branch != undefined) {
      this.formModel.patchValue({
        branch      : settings.branch,
        securityKey : settings.securityKey == undefined ? '' : '****************',
      });
    }
  }

  onSubmit() {
    console.log('OnSubmit:');

    let securityKey = this.formModel.value.securityKey;

    if (securityKey.charAt(0) != '*') {
      let settings = {
        branch      : this.formModel.value.branch,
        securityKey : this.formModel.value.securityKey,
      };
      localStorage.setItem("settings", JSON.stringify(settings));
      this.refreshData();
    }
  }
}
