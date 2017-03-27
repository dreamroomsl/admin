import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';

import { ROUTING } from './app.routing';
import { MyApp } from './app/app';
import { Settings } from './app/settings/settings';
import { Bonus } from './app/bonus/bonus';
import { Reports } from './app/reports/reports';
import { Home } from './app/home/home';

@NgModule({
  imports: [ BrowserModule, HttpModule, ROUTING, FormsModule, ReactiveFormsModule ],
  providers: [
      { provide: LOCALE_ID, useValue: "es-ES" }
  ],
  declarations: [ MyApp, Home, Bonus, Settings, Reports ],
  bootstrap: [ MyApp ]
})
export class AppModule {}
