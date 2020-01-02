import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDetails, UserInterest, UserLookingFor } from '../../models/user.model';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { config } from '../../config/config';
import { LoaderService } from '../services/loader.service';
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType } from '@aspnet/signalr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})

export class SignupComponent implements OnInit {
  registrationFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  public _httpClient: HttpClient;
  public showSignupForm: Boolean;
  showOnSuccess = false;
  public isValidEmail: Boolean;
  public user = new UserDetails(null);
  IsLoggedIn: boolean;
  passwordPattern = new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");

  // Social signIn variables
  Loginuserid: any;
  Token: any;
  public _hubConnection: HubConnection;
  public display = true;
  public FirstName: string;
  public chekUidPass = false;
  public emailEmptyForgotPassword = false;
  public NotificationList: any = [];

  constructor(private formBuilder: FormBuilder, http: HttpClient, private router: Router, private data: DataService,
    private _sanitizer: DomSanitizer, private _loaderService: LoaderService, private authService: AuthService) {
    this._httpClient = http;
    this.showSignupForm = true;
    this.isValidEmail = false;
  }

  ngOnInit() {

    this._loaderService.show();

    this.passwordFormGroup = this.formBuilder.group({
      password: ['', [Validators.required]]
    });
    this.registrationFormGroup = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('[A-Za-z^]*')]],
      lastName: ['', [Validators.required, Validators.pattern('[A-Za-z^]*')]],
      username: '',
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      passwordFormGroup: this.passwordFormGroup,
    });

    this.data.currentMessage.subscribe(IsLoggedIn => this.IsLoggedIn = IsLoggedIn);

    setTimeout(() => {
      this._loaderService.hide();
    }, 2000);

    this.isValidEmail = true;

    var userEmail = localStorage.getItem('signUpEmail');

    if (userEmail) {
      this.registrationFormGroup.controls['email'].setValue(userEmail);
      this.CheckEmail();
      localStorage.removeItem('signUpEmail');
    }
  }

  public Signup() {

    this._loaderService.show();

    if (this.registrationFormGroup.invalid) {
      return;
    }
    if (!this.isValidEmail) {
      return;
    }

    this.registrationFormGroup.value.username = this.generateUserName();

    this.user.FirstName = this.registrationFormGroup.value.firstName;
    this.user.LastName = this.registrationFormGroup.value.lastName;
    this.user.Password = this.passwordFormGroup.value.password;
    this.user.Email = this.registrationFormGroup.value.email;
    this.user.UserName = this.registrationFormGroup.value.username;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    setTimeout(() => {
      this._loaderService.hide();
    }, 2000);

    this._httpClient.post(config.ServiceUrl + '/api/gateway/register', JSON.stringify(this.user), httpOptions).subscribe(data => {
      this.showSignupForm = false;
      this.showOnSuccess = true;
    }, error => {
      console.log(JSON.stringify(error.json()));
    });

  }

  generateUserName(): string {
    var userName = '';
    var name = this.registrationFormGroup.value.firstName;
    if (name) {
      var randomNumber = Math.floor(Math.random() * 100);
      userName = name + randomNumber;
    }

    return userName;
  }

  public CheckEmail() {
    var email = this.registrationFormGroup.value.email;
    if (email) {
      this._httpClient.get<string>(config.ServiceUrl + '/api/gateway/email/' + email).subscribe(result => {
        this.isValidEmail = true;
      }, error => {
        if (error.status == 200 && error.error && error.error.text == "Email Already Exists") {
          this.isValidEmail = false;
        }
        console.log(error)
      });
    }
    else {
      this.isValidEmail = true;
    }

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
                  //if (this.Token && this.Loginuserid) {
                  //  this.createConnection();
                  //  this.startConnection();
                  //}
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
                this.user = new UserDetails(data);
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
              this.user = new UserDetails(data);
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
          console.log(socialPlatform + " sign in data : ", userData)
        }
        console.log(socialPlatform + " sign in data : ", userData);
      }
    );
  }

  //private createConnection() {
  //  this._hubConnection = new HubConnectionBuilder()
  //    .withUrl(config.ServiceUrl + "/MyChatHub?UserID=" + this.Loginuserid + "&token=" + this.Token, {
  //      skipNegotiation: true,
  //      transport: HttpTransportType.WebSockets
  //    })
  //    .configureLogging(LogLevel.Debug)
  //    .build();
  //}
  //private startConnection(): void {
  //  this._hubConnection
  //    .start()
  //    .then(data => {
  //      console.log('Hub connection started');

  //      if (this.Loginuserid) {
  //        this._hubConnection.invoke('GetNotificationForUser', this.Loginuserid).then(data => {
  //          debugger
  //          console.log(data);
  //          this._hubConnection.on('GetNotificationForUser', (data) => {
  //            debugger
  //            console.log(data);
  //          })

  //        })
  //      }
  //    })
  //    .catch(err => {
  //      console.log('Error while establishing connection, retrying...');
  //      setTimeout(() => this.startConnection(), 5000);
  //    });
  //}

  getNotification() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this._httpClient.get(config.ServiceUrl + '/api/Gateway/GetNotification?userid=' + this.Loginuserid, httpOptions).subscribe(data => {
      this.NotificationList = data;
      this.data.getNotificationList(data);
    });
  }

}
