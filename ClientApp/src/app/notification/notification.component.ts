import { Component, OnInit,Inject,EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { config } from '../../config/config';
import { LoaderService } from '../services/loader.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { DEFAULTIMAGES } from '../../constants/constants';
import { _ } from 'underscore';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  public NotificationList:any=[];
  public notificationCount:any=0;
  public _httpClient: HttpClient;
  Loginuserid: any;
  rootImgPath: any = config.imgPath;
  defaultUserImg = DEFAULTIMAGES.UserImage;

  constructor(http: HttpClient, private router: Router, private data: DataService, @Inject('BASE_URL') lbaseUrl: string,
 public _loaderService: LoaderService) {
  this._httpClient = http;
  }

  ngOnInit() {
    this.Loginuserid = window.localStorage.getItem('id');
    if(this.Loginuserid)
        this.getNotification();
  }

  getNotification(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this._httpClient.get(config.ServiceUrl + '/api/Gateway/GetNotification?userid=' + this.Loginuserid, httpOptions).subscribe(data => {
      this.NotificationList=data;
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
