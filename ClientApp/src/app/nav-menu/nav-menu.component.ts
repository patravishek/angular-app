import { Component, OnInit, Inject,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { UserDetails, UserLookingFor } from '../../models/user.model';
import { EventPageComponent } from '../events/eventPage.component';
import { DataService } from '../services/data.service';
//import { CommonService } from '../services/common.service';
import * as $ from 'jquery';
//import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider } from "angularx-social-login";
import { config } from '../../config/config';
import { LoginService } from '../services/login.service';
import { LoaderService } from '../services/loader.service';
import * as signalR from '@aspnet/signalr';
import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType } from '@aspnet/signalr';
import { _ } from 'underscore';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  public displayType = 'display:none';
  public display = true;
  public userDetails = new UserDetails();
  public chekUidPass = false;
  public IsLoggedIn = false;
  public _httpClient: HttpClient;
  public username: string;
  public password: string;
  public FirstName: string;
  public LastName: string;
  public x: string;
  public emailEmptyForgotPassword = false;
  private baseUrl: string;
  public resetPasswordSuccess = false;
  public newPassword: string;
  public user = new UserDetails(null);
  public email = null;
  public IsLinkSentSuccess = false;
  public IsSubmitted = false;
  connectionEstablished = new EventEmitter<Boolean>();
  Loginuserid: any;
  Token: any;
  public _hubConnection: HubConnection;
  public NotificationList:any=[];
  public notificationCount:any=0;
  rootImgPath: any = config.imgPath;
  constructor(http: HttpClient, private router: Router, private data: DataService, @Inject('BASE_URL') lbaseUrl: string,
    private authService: AuthService, private _LoginService: LoginService, public _loaderService: LoaderService) {
    this._httpClient = http;
    //Code to check the local storage for token
    var token = window.localStorage.getItem('token');

    if (token != null) {
      this.data.changeMessage(true);
      this.data.displayUserName(window.localStorage.getItem('name'));
    }
    else
      this.IsLoggedIn = false;

    this.baseUrl = lbaseUrl;
  }

  ngOnInit() {
    this.Loginuserid = window.localStorage.getItem('id');
    this.data.currentMessage.subscribe(IsLoggedIn => this.IsLoggedIn = IsLoggedIn);
    this.data.userName.subscribe(FirstName => this.FirstName = FirstName);
    this.data.NotificationList.subscribe(Notification=>this.NotificationList=Notification);
    this.data.Notificationcount.subscribe(Notification=>this.notificationCount=Notification);

    if(this.Loginuserid)
         this.getNotification();
  }

  public openModal() {
    this.displayType = 'display:block';
  }

  public SignOut() {
    this._loaderService.show();
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("name");
    window.localStorage.removeItem("id");
    this.data.changeMessage(false);
    this.data.displayUserName("");
    this.data.getNotificationList("");
    this._loaderService.hide();
    this.router.navigateByUrl('/');
  }

  //public ResetPassword() {
  //  this.chekUidPass = false;
  //  if (this.username === null || this.username === undefined || this.username.length === 0) {
  //    this.emailEmptyForgotPassword = true;
  //  }
  //  //if (!this.cs.validateEmail(this.username)) {
  //  //  this.emailEmptyForgotPassword = true;
  //  //}

  //  if (!this.emailEmptyForgotPassword) {
  //    var payload = { "emailAddress": this.username };
  //    const httpOptions = {
  //      headers: new HttpHeaders({
  //        'Content-Type': 'application/json'
  //      })
  //    };
  //    this._httpClient.post(this.baseUrl + 'api/gateway/resetpassword', payload, httpOptions).subscribe(data => {
  //      this.newPassword = data.toString();
  //      this.resetPasswordSuccess = true;
  //    });
  //  }
  //}

  public SignIn(form) {
    if (form.invalid)
      return;
    var payload = { "username": this.username, "password": this.password };
    this.emailEmptyForgotPassword = false;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this._loaderService.show();
    this._httpClient.post(config.ServiceUrl + '/api/gateway/login', JSON.stringify(payload), httpOptions).subscribe(data => {
      console.log(data);
      this._loaderService.hide();
      this.userDetails = new UserDetails(data);
      setTimeout(() => {
        this._loaderService.hide();
      }, 3000);

      window.localStorage.setItem('token', data["Token"]);
      window.localStorage.setItem('name', data["Name"]);
      window.localStorage.setItem('id', data["Id"]);
      this.display = false;
      $("#signIn").hide();
      $(".modal-backdrop").hide();
      this.router.navigateByUrl('/feed');
      this.display = false;
      this.chekUidPass = false;
      this.FirstName = window.localStorage.getItem('name');
      this.IsLoggedIn = true;

      this.Token = window.localStorage.getItem('token');
      this.Loginuserid = window.localStorage.getItem('id');
      // if (this.Token && this.Loginuserid) {
      //     this.createConnection();
      //     this.startConnection();
      // }
      this.getNotification();
    }, error => {
      setTimeout(() => {
        this._loaderService.hide();
      }, 3000);
      // console.log(JSON.stringify(error.json()));
      this.chekUidPass = true;

    });

    // this.display = false;
    //   $("#signIn").hide();
    //   $(".modal-backdrop").hide();
    //   this.router.navigateByUrl('/myprofile');
    //   this.display = false;
    //   // this.FirstName = window.localStorage.getItem('name');
    //   this.IsLoggedIn = true;
  }

  //Social Login

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this._loaderService.show();
    this.authService.signIn(socialPlatformProvider).then(
      (userData) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };
        if (userData) {


          this._httpClient.get(config.ServiceUrl + '/api/gateway/email/' + userData.email, httpOptions).subscribe(data => {
            if (!data) {

              //signup
              this.user.FirstName = userData.firstName;
              this.user.LastName = userData.lastName;
              this.user.UserName = userData.email;
              this.user.Email = userData.email;
              this.user.IsSocialLogin = true;
              this.user.Providername = userData.provider;
              this.user.Profileurl = userData.photoUrl;

              this._httpClient.post(config.ServiceUrl + '/api/gateway/register', JSON.stringify(this.user), httpOptions).subscribe(data => {
                var payload = { "username": userData.email, "password": null, IsSocialLogin: "true" };
                this._httpClient.post(config.ServiceUrl + '/api/gateway/login', JSON.stringify(payload), httpOptions).subscribe(data => {
                  console.log(data);
                  this._loaderService.hide();
                  window.localStorage.setItem('token', data["Token"]);
                  window.localStorage.setItem('name', data["Name"]);
                  window.localStorage.setItem('id', data["Id"]);
                  this.data.changeMessage(true);
                  this.data.displayUserName(data["Name"]);
                  $("#signIn").hide();
                  $(".modal-backdrop").hide();
                  this.router.navigateByUrl('/feed');

                  setTimeout(() => {
                    this._loaderService.hide();
                  }, 3000);

                  this.Token = window.localStorage.getItem('token');
                  this.Loginuserid = window.localStorage.getItem('id');
                  // if (this.Token && this.Loginuserid) {
                  //     this.createConnection();
                  //     this.startConnection();
                  // }
                  this.getNotification();
                }, error => {
                  this._loaderService.hide();
                  console.log(JSON.stringify(error.json()));
                  setTimeout(() => {
                    this._loaderService.hide();
                  }, 3000);
                })
              }, error => {
                this._loaderService.hide();
                console.log(JSON.stringify(error.json()));
                setTimeout(() => {
                  this._loaderService.hide();
                }, 3000);
              });
            }
            else {
              //Login
              var payload = { "username": userData.email, "password": null, IsSocialLogin: true };
              this.emailEmptyForgotPassword = false;
              const httpOptions = {
                headers: new HttpHeaders({
                  'Content-Type': 'application/json'
                })
              };

              this._loaderService.show();
              this._httpClient.post(config.ServiceUrl + '/api/gateway/login', JSON.stringify(payload), httpOptions).subscribe(data => {
                console.log(data);
                this._loaderService.hide();
                this.userDetails = new UserDetails(data);
                setTimeout(() => {
                  this._loaderService.hide();
                }, 3000);
                window.localStorage.setItem('token', data["Token"]);
                window.localStorage.setItem('name', data["Name"]);
                window.localStorage.setItem('id', data["Id"]);
                this.display = false;
                $("#signIn").hide();
                $(".modal-backdrop").hide();
                this.router.navigateByUrl('/feed');
                this.display = false;
                this.chekUidPass = false;
                this.FirstName = window.localStorage.getItem('name');
                this.IsLoggedIn = true;
              }, error => {
                // console.log(JSON.stringify(error.json()));
                this.chekUidPass = true;

              });
            }
          }, error => {
            var payload = { "username": userData.email, "password": null, IsSocialLogin: true };
            this.emailEmptyForgotPassword = false;
            const httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json'
              })
            };
            this._loaderService.show();
            this._httpClient.post(config.ServiceUrl + '/api/gateway/login', JSON.stringify(payload), httpOptions).subscribe(data => {
              console.log(data);
              this.userDetails = new UserDetails(data);
              setTimeout(() => {
                this._loaderService.hide();
              }, 3000);
              window.localStorage.setItem('token', data["Token"]);
              window.localStorage.setItem('name', data["Name"]);
              window.localStorage.setItem('id', data["Id"]);
              this.display = false;
              $("#signIn").hide();
              $(".modal-backdrop").hide();
              this.router.navigateByUrl('/feed');
              this.display = false;
              this.chekUidPass = false;
              this.FirstName = window.localStorage.getItem('name');
              this.IsLoggedIn = true;
            }, error => {
              // console.log(JSON.stringify(error.json()));
              this.chekUidPass = true;

            });
            this._loaderService.hide();
            console.log(JSON.stringify(error.json()));
          });

        }
        else {
          this._loaderService.hide();
          console.log(socialPlatform + " sign in data : ", userData)
        }
        this._loaderService.hide();
        console.log(socialPlatform + " sign in data : ", userData);
      }
    );
    this._loaderService.hide();
  }

  sendForgotPasswordMail(form) {
    if (form.invalid) {
      this.IsSubmitted = true;
      return;
    }
    this._loaderService.show();
    this.IsSubmitted = false;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
      })
    };

    var user = { Emailid: this.email };
    this._loaderService.show()
    this._httpClient.post(config.ServiceUrl + '/api/Gateway/ForgetPassword', JSON.stringify(user), httpOptions).subscribe(data => {
      this._loaderService.hide();
      this.IsLinkSentSuccess = true;
      this.email = null;
      setTimeout(() => {
        this._loaderService.hide();
      }, 3000);
      //close forgot password popup
      $("#resetPassword").hide();
      //$(".modal-backdrop").hide();
    }, error => {
      this._loaderService.hide();
    });
  }

  private createConnection() {
    this._hubConnection = new HubConnectionBuilder()
        .withUrl(config.ServiceUrl+"/MyChatHub?UserID=" + this.Loginuserid + "&token=" + this.Token, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        })
        .configureLogging(LogLevel.Debug)
        .build();
}
private startConnection(): void {
    this._hubConnection
        .start()
        .then(data => {
            console.log('Hub connection started');

              })
        .catch(err => {
            console.log('Error while establishing connection, retrying...');
            setTimeout(() => this.startConnection(), 5000);
        });
}

getNotification(){
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  this._httpClient.get(config.ServiceUrl + '/api/Gateway/GetNotification?userid=' + this.Loginuserid, httpOptions).subscribe(data => {
    this.NotificationList=data;
    //this.notificationCount=this.NotificationList.length;
    this.notificationCount=_.filter(this.NotificationList, function(obj){
      return obj.status  == false; 
    }).length;
    this.data.getNotificationList(data);
    this.data.getNotificationCount(this.notificationCount);
  });
}

ReadNotificatio(item){
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  var payload = { notificationid: item.notificationid, notificationfor: item.notificationfor, status: true };
  this._httpClient.post(config.ServiceUrl + '/api/Gateway/ReadUnreadNotification', JSON.stringify(payload),httpOptions).subscribe(data => {
   
    if(data){
      this.getNotification();
    }
  });
}

}
