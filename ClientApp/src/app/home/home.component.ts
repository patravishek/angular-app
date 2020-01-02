import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { config } from '../../config/config';
import { LoaderService } from '../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  newsLetterFormGroup: FormGroup;
  submitted = false;
  userEmail: any = {};
  constructor(private formBuilder: FormBuilder, private http: HttpClient,
    private _loaderService: LoaderService, private toaster: ToastrService,private router: Router) {
  }
  ngOnInit() {

    this.newsLetterFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]]
    });


  }

  SubscribeNews() {
    if (this.newsLetterFormGroup.invalid) {
      this.submitted = true;
      return;
    }

    this._loaderService.show();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
   // this.toaster.success("Subscribe successfully.");
    this.userEmail.email = this.newsLetterFormGroup.value.email;
    //this._loaderService.show();

    localStorage.setItem('signUpEmail',this.userEmail.email);
    this.router.navigate(['/sign-up']);

    // this.http.post(config.ServiceUrl + '/api/gateway/Post/addNewsFeed',
    //   JSON.stringify(this.userEmail), httpOptions).subscribe(data => {
    //     this._loaderService.hide();
    //     //this.toaster.success("Success","Subscribe successfully.");
    //     this.userEmail={};
    //     this.newsLetterFormGroup.reset();
    //     setTimeout(() => {
    //       this._loaderService.hide();
    //       },3000);
    //   });


  }
}
