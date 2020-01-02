import { Component, OnInit } from '@angular/core';
import { SuggestedFarmer } from '../../models/SuggestedFarmer.model';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { config } from '../../config/config';
import { Router } from '@angular/router'
import { LoaderService } from '../services/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-suggested-farmers',
  templateUrl: './suggested-farmers.component.html',
})
export class SuggestedFarmersComponent implements OnInit {
  inviteUserFormGroup: FormGroup;
  public suggestedFarmers: SuggestedFarmer[];
  loggedInUserId: any = localStorage.getItem('id');
  imgPath: any = config.imgPath;
  submitted = false;
  Email:any;

  constructor(private _httpClient: HttpClient, private router: Router, public _loaderService: LoaderService,
    private formBuilder: FormBuilder, private toaster: ToastrService) { }

  ngOnInit() {

    this.inviteUserFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]]
    });

    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    });
    this._loaderService.show();
    this._httpClient.get<SuggestedFarmer[]>(config.ServiceUrl + '/api/gateway/suggestedfarmers', { headers: httpOptions }).subscribe(data => {
      this.suggestedFarmers = data.map(a => new SuggestedFarmer(a));
      setTimeout(() => {
        this._loaderService.hide();

      }, 3000);
    },
      error => {
        setTimeout(() => {
          this._loaderService.hide();

        }, 3000);
      });
  }

  userFollowfun(selectedUser) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
      })
    };

    this._loaderService.show();
    var user = { OwnerUserId: this.loggedInUserId, FollowerUserId: selectedUser.FarmId, IsFollow: !selectedUser.IsFollow };
    this._httpClient.post(config.ServiceUrl + '/api/Gateway/Post/userFollowfun', JSON.stringify(user), httpOptions).subscribe(data => {
      selectedUser.IsFollow = !selectedUser.IsFollow;
      this._loaderService.hide();
      this.ngOnInit();
    }, error => {
      this._loaderService.hide();
    });
  }

  viewUserProfile(id) {
    if (id) {
      this.router.navigate(['/userProfile/' + id])
    }
  }

  inviteUsers() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
      })
    };


    this._loaderService.show();
    if (this.inviteUserFormGroup.invalid) {
      this.submitted = true;
      this._loaderService.hide();
      return;
    }

    this.Email = this.inviteUserFormGroup.value.email;
    //Post/SendInvitationtoUser

    var user = { email: this.Email};
    this._httpClient.post(config.ServiceUrl + '/api/Gateway/Post/SendInvitationtoUser', JSON.stringify(user), httpOptions).subscribe(data => {
      this._loaderService.hide();
      this.inviteUserFormGroup.value.email="";
      this.toaster.success("Invitation sent on this mail please check.");
    }, error => {
      this._loaderService.hide();
    });
  }

}
