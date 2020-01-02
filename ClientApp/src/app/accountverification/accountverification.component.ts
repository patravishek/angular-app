import { Component, OnInit } from '@angular/core';
import { config } from '../../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../services/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-accountverification',
  templateUrl: './accountverification.component.html',
  styleUrls: ['./accountverification.component.css']
})
export class AccountverificationComponent implements OnInit {

  userName: any;
  verificationMsg: string;
  isResponseGet = false;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    })
  };
  loggedInUserId = localStorage.getItem('id');
  constructor(private http: HttpClient, private router: ActivatedRoute
    , public _loaderService: LoaderService, private toaster: ToastrService) {
  }
  ngOnInit() {
  //  this.route.queryParams.subscribe(map => map)
    this.router.queryParams.subscribe(params => {
      this.userName = params['username'];

      if (this.userName)
        this.validateEmail();
    })
  }

  validateEmail() {
    this._loaderService.show();
    this.http.get(config.ServiceUrl + '/api/gateway/ValidateEmail?UserName=' + this.userName, this.httpOptions).subscribe((data) => {
      this.isResponseGet = true;
      this.verificationMsg = "Email is confirmed";

      setTimeout(() => {
        this._loaderService.hide();
      }, 2000);
    },
      error => {
        this.isResponseGet = true;
        if (error.status == 200 && error.error && error.error.text == "Email is confirmed") {
          this.verificationMsg = error.error.text;
        }
        else
          this.verificationMsg = null;
       
          this._loaderService.hide();
      });
  }
}


