import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-signup-popup',
  templateUrl: './signup-popup.component.html',
})
export class SignUpPopupComponent {
  public token: string;
  public _httpClient: HttpClient;
  public username: string;
  public password: string;
  public displayType: Boolean
  public IsLoggedIn: Boolean;

 // @Output()
  //IsLoggedIn: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor(http: HttpClient, private router: Router) {
    this._httpClient = http;
    this.displayType = true;
  }

  public SignIn() {
    //Email Validation
    var payload = { "username": this.username, "password": this.password };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this._httpClient.post('./api/gateway', JSON.stringify(payload), httpOptions).subscribe(data => {
      console.log(data["token"]);

      window.localStorage.setItem('token', data["token"]);
      this.displayType = false;
      $("#signIn").hide();
      $(".modal-backdrop").hide();
      this.router.navigateByUrl('/myprofile');
      this.displayType = false;
      this.IsLoggedIn = true;
    }, error => {
      console.log(JSON.stringify(error.json()));
    });
    
   }
}

interface WeatherForecast {
  dateFormatted: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
