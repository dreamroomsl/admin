import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import {Http } from '@angular/http';
import {Settings, SettingsInfo } from '../settings/settings';
import * as bootbox from 'bootbox';
import * as app     from '../app'
import 'rxjs/add/operator/map';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'dr-bonus',
  template: require('./bonus.html'),
})
export class Bonus {

  formModel: FormGroup;

  balance     : number;
  statements  = [];
  searchData  = [];
  settings    : SettingsInfo;

  showBalance = false;
  showNoExist = false;
  showOptions = false;
  showOk      = false;

  constructor(private http: Http) {
    this.formModel = new FormGroup({
      'telephone' : new FormControl(),
      'ticketId'  : new FormControl('', Validators.pattern('[0-9]{5}')),
      'name'      : new FormControl(),
    });

    this.balance = 0;
    this.settings = Settings.get();
  }

  getSecurityToken(data : string) : string {
    console.log('Data to encrypt=' + data);

    var key = CryptoJS.enc.Utf8.parse(this.settings.securityKey);
    var iv  = CryptoJS.enc.Utf8.parse(this.settings.securityKey);

    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key,
                    {
                        keySize: 128 / 8,
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    });

    console.log('Data encrypted=' + encrypted.toString(CryptoJS.enc.Utf8));

    return "" + encrypted;
  }

  sendAction(minutes : number, cash : number) {
    let bonus : any = {
      telephone     : this.formModel.value.telephone,
      branch        : this.settings.branch,
      name          : this.formModel.value.name        || '',
      ticketId      : this.formModel.value.ticketId    || '',
      securityToken : this.getSecurityToken(this.formModel.value.ticketId + this.settings.branch + this.statements.length),
    };

    if (minutes != 0) {
      bonus.minutes = minutes;
    }

    if (cash != 0) {
      bonus.cash = cash;
    }

    this.http.post(app.nodejsServer + '/bonus/', bonus)
    .map(response => response.json())
    .subscribe(response => {
      console.log('Data=' + JSON.stringify(response, undefined, 2));

      if (response.error == true) {
        console.log("ERROR!!")
        bootbox.alert('No se ha podido actualizar la información. <strong>' + response.message + '</strong>');
      } else {
        this.showOk = true;

        setTimeout(() => {this.showOk = false;}, 500);
        this.searchBonus();
      }
    });
  }

  duplicateBonus(minutes : number, cash : number) {
    this.http.get(app.nodejsServer + '/nextbonus/' + this.settings.branch)
    .map(response => response.json())
    .subscribe(response => {
        this.formModel.patchValue({
          ticketId    : response.next,
        });
        this.statements  = [];
        this.sendAction(minutes, cash);
    });
  }


  clearFields() {
    this.formModel.reset();

    this.balance     = 0;
    this.showNoExist = false;
    this.showBalance = false;
    this.showOptions = false;
    this.statements  = [];
    this.searchData  = [];
  }

  searchByName() {
    if (Number(this.formModel.value.ticketId) != 0) {
      return;
    }

    let name = this.formModel.value.name;

    this.http.get(app.nodejsServer + '/bonusbyname/' + this.settings.branch + '/' + name)
    .map(response => response.json())
    .subscribe(response => {

      if (!response.error) {
        this.searchData = response.register;
      }
    });
  }

  searchByTelephone() {
    if (Number(this.formModel.value.ticketId) != 0) {
      return;
    }

    let telephone = this.formModel.value.telephone;

    this.http.get(app.nodejsServer + '/bonusbytelephone/' + this.settings.branch + '/' + telephone)
    .map(response => response.json())
    .subscribe(response => {

      if (!response.error) {
        this.searchData = response.register;
      }
    });
  }

  searchByTicketId(ticketId) {
    this.formModel.patchValue({
      ticketId    : ticketId,
    });
    this.searchBonus();
  }

  searchNextBonusId() {
    this.http.get(app.nodejsServer + '/nextbonus/' + this.settings.branch)
    .map(response => response.json())
    .subscribe(response => {
        this.formModel.patchValue({
          ticketId    : response.next,
        });
        this.searchBonus();
    });
  }

  searchBonus() {
    let ticketId = this.formModel.value.ticketId;

    console.log('searchSubmit:' + ticketId);

    if (isNaN(Number(ticketId))) {
      ticketId = undefined;
    }

    if (ticketId == undefined || ticketId.length == 0) {
      this.searchNextBonusId();
    }

    this.http.get(app.nodejsServer + '/bonus/' + this.settings.branch + '/' + ticketId)
    .map(response => response.json())
    .subscribe(response => {
      console.log('Data=' + JSON.stringify(response, undefined, 2));

      if (response.error == true) {
        console.log("ERROR!!")
        this.clearFields();

        this.formModel.patchValue({
          ticketId   : ticketId,
        });
        this.showNoExist = true;
        this.showBalance = false;
        this.statements  = [];
      } else {
        this.formModel.patchValue({
          name        : response.register.data.name,
          telephone   : response.register.data.telephone,
        });
        this.balance     = response.register.balance;
        this.statements  = response.register.data.statements || [];
        this.showNoExist = false;
        this.showBalance = true;

        this.statements.sort((a, b) => {
          let date1 = new Date(a.date);
          let date2 = new Date(b.date);

          return date2.getTime() - date1.getTime();
        });
      }
      if (Number(ticketId) >= 1) {
        if (this.settings.branch != undefined &&
            this.settings.branch.length == 3 &&
            this.settings.securityKey != undefined &&
            this.settings.securityKey.length == 16) {

              this.showOptions = true;
        }
      } else {
        this.showOptions = false;
      }
    });

    $('#name').focus();
  }
}
