import { Component, OnInit } from '@angular/core';
//import { ReCaptchaV3Service } from 'ngx-captcha';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  public contactFormGroup: FormGroup;
  public siteKey = "6LefqIYUAAAAADMrKVs8KALQhX8JPr7QYpNJvtcD";
  

  //public  reCaptchaV3Service: ReCaptchaV3Service
  constructor(private formBuilder: FormBuilder,
    ) { }

  ngOnInit() {
    this.contactFormGroup = this.formBuilder.group({
      firstName: '',
      userEmail: '',
      message: ''
    });
  }

  // verifyCaptcha() {
  //   //Way 2 - Todo dev- change action_name which is created in API 
  //   this.reCaptchaV3Service.execute(this.siteKey, 'action_name', (token) => {
  //     console.log('This is your token: ', token);
  //   }
  //   );
  // }

}
