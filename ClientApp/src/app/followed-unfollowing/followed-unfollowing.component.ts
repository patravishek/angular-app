import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { config } from '../../config/config';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from '../services/loader.service';
import * as _ from 'underscore';
import { DEFAULTIMAGES } from '../../constants/constants';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/delay';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';

@Component({
  selector: 'app-followed-unfollowing',
  templateUrl: './followed-unfollowing.component.html',
  styleUrls: ['./followed-unfollowing.component.css']
})
export class FollowedUnfollowingComponent implements OnInit {
  public _httpClient: HttpClient;
  public followrsList: any = [];
  public followingList: any = [];
  rootImgPath = config.imgPath;
  IsFollowerUsers: any = true;
  IsFollowingUsers: any = false
  searchText: any;
  defaultUserImg = DEFAULTIMAGES.UserImage;

  //Search authocomplete
  UserList: any = [];
  @ViewChild('instance') instance: NgbTypeahead;
  focusSearchUser$ = new Subject<string>();
  clickSearchUser$ = new Subject<string>();
  SelectedUser: any;
  //End search autocomplete

  constructor(http: HttpClient, private formBuilder: FormBuilder, private router: Router
    , public _loaderService: LoaderService) {
    this._httpClient = http;
  }

  ngOnInit() {
    this.GetFollowersList();
    this.getSearchUserList();
  }

  GetFollowersList() {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    });
    this._loaderService.show();
    this._httpClient.get(config.ServiceUrl + '/api/gateway/GetFollowedbyUserList', { headers: httpOptions }).subscribe(data => {
      this.followrsList = data;
      var parentThis = this;
      this.followrsList.forEach(function (item) {
        item.userProfilePic = (item.userProfilePic) ? (parentThis.rootImgPath + item.userProfilePic) : parentThis.defaultUserImg;
      });


      setTimeout(() => {
        this._loaderService.hide();

      }, 2000);
      this.IsFollowingUsers = false;
      this.IsFollowerUsers = true;
    },
      error => {
        setTimeout(() => {
          this._loaderService.hide();

        }, 2000);
      });

  }


  GetFollowingList() {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    });
    this._loaderService.show();
    this._httpClient.get(config.ServiceUrl + '/api/gateway/GetFollowingUserList', { headers: httpOptions }).subscribe(data => {
      this.followingList = data;
      var parentThis = this;

      this.followingList.forEach(function (item) {
        item.userProfilePic = (item.userProfilePic) ? (parentThis.rootImgPath + item.userProfilePic) : parentThis.defaultUserImg;
      });
      setTimeout(() => {
        this._loaderService.hide();

      }, 2000);
      this.IsFollowingUsers = true;
      this.IsFollowerUsers = false;
    },
      error => {
        setTimeout(() => {
          this._loaderService.hide();

        }, 2000);
      });

  }

  // searchUser() {
  //   var searchtxt = this.searchText
  //   if (this.searchText) {
  //     if (this.IsFollowingUsers) {
  //       this.followingList = _.filter(this.followingList, function (obj) {
  //         if (((obj.userFirstName && obj.userFirstName.toLowerCase().includes(searchtxt.toLowerCase()))
  //           || (obj.userLastName && obj.userLastName.toLowerCase().includes(searchtxt.toLowerCase()))
  //           || (obj.farmerName && obj.farmerName.toLowerCase().includes(searchtxt.toLowerCase()))
  //           || (obj.userLastName && obj.userFirstName && (obj.userFirstName + " " +obj.userLastName).toLowerCase().includes(searchtxt.toLowerCase()))
  //           || (obj.city && obj.city.toLowerCase().includes(searchtxt.toLowerCase()))
  //           || (obj.state && obj.state.toLowerCase().includes(searchtxt.toLowerCase())))) {
  //           return obj;
  //         }
  //       });
  //     }
  //     else if (this.IsFollowerUsers) {
  //       this.followrsList = _.filter(this.followrsList, function (obj) {
  //         if (((obj.userFirstName && obj.userFirstName.toLowerCase().includes(searchtxt.toLowerCase()))
  //           || (obj.userLastName && obj.userLastName.toLowerCase().includes(searchtxt.toLowerCase()))
  //           || (obj.farmerName && obj.farmerName.toLowerCase().includes(searchtxt.toLowerCase()))
  //           || (obj.userLastName && obj.userFirstName && (obj.userFirstName + " " +obj.userLastName).toLowerCase().includes(searchtxt.toLowerCase()))
  // 	        || (obj.city && obj.city.toLowerCase().includes(searchtxt.toLowerCase()))
  //           || (obj.state && obj.state.toLowerCase().includes(searchtxt.toLowerCase())))) {
  //           return obj;
  //         }
  //       });

  //     }

  //   }
  // }

  refreshList() {
    if (this.IsFollowingUsers)
      this.GetFollowingList()
    else if (this.IsFollowerUsers)
      this.GetFollowersList()
    this.searchText = null;
  }

  // viewUserProfile(id) {
  //   if (id) {
  //     this.router.navigate(['/userProfile/' + id])
  //   }
  // }

  //Block Unblock and Unfollow user 
  folllowUnfollowUser(user,type) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
      })
    };
    var isFollowe = true;
    if(type == 'Unfollow')
      isFollowe  = false;
    var LoginUserId = window.localStorage.getItem('id')
    var paramUserBlock = { FollowerUserId: user.userId, OwnerUserId: LoginUserId, IsFollow: isFollowe };
    if (user.isFollowed)
      user.isFollowed = false;
    else
      user.isFollowed = true;

    this._loaderService.show();
    this._httpClient.post(config.ServiceUrl + '/api/Gateway/Post/userFollowfun', JSON.stringify(paramUserBlock), httpOptions).subscribe(data => {
      this._loaderService.hide();
      this.refreshList();

    }, error => {
      this._loaderService.hide();
    });
  }

  //Get user list for search
  getSearchUserList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
      })
    };
    this._loaderService.show();
    this._httpClient.get(config.ServiceUrl + '/api/gateway/GetUserListBySearchString', httpOptions).subscribe((data: any) => {
      this._loaderService.hide();
      this.UserList = data;
    },
      error => {
        this._loaderService.hide();
      });

  }

  //Search user autocomplete start
  searchUser = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    //const clicksWithClosedPopup$ = this.clickSearchUser$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focusSearchUser$; //clicksWithClosedPopup$
    return merge(debouncedText$, inputFocus$).pipe(
      map(term => (term === '' ? this.UserList
        : this.UserList.filter(v => v.fullName.toLowerCase().indexOf(term != null ? term.toLowerCase() : "") > -1)).slice(0, 10))
    );
  }
  formatterUser = (x: { fullName: string }) => x.fullName;

  selectedUser(item) {
    this.SelectedUser = item.item;
  }

  //Search user autocomplete start

  //view User Profile
  viewUserProfile(id) {
    if (this.SelectedUser && this.SelectedUser.userId) {
      this.router.navigate(['/userProfile/' + this.SelectedUser.userId]);
    }
    else {
      if (id)
        this.router.navigate(['/userProfile/' + id]);
    }
  }

}
