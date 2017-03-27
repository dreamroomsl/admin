import { Component, OnInit } from '@angular/core';

export const nodejsServer = '/admin/api';

@Component({
  selector: 'my-app',
  styleUrls: [ 'app.css' ],
  template: require('./app.html')
})
export class MyApp implements OnInit {

  ngOnInit() {
    $.fn.datepicker.defaults.language       = "es";
    $.fn.datepicker.defaults.todayHighlight = true;
    $.fn.datepicker.defaults.autoclose      = true;
  }
}
