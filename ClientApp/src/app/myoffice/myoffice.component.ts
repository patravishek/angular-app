import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@aspnet/signalr';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { config } from '../../config/config';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { _ } from 'underscore';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/delay';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { merge } from 'rxjs/observable/merge';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DEFAULTIMAGES } from '../../constants/constants';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType } from '@aspnet/signalr';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
    selector: 'app-myoffice',
    templateUrl: './myoffice.component.html',
    styleUrls: ['./myoffice.component.css']
})
export class MyOfficeComponent implements OnInit {
    Loginuserid: any;
    Token: any;
    userList: any;
    userMessageList: any;
    private connectionIsEstablished = false;
    public _hubConnection: HubConnection;
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        })
    };

    //Search autocomplete
    UserList: any = [];
    @ViewChild('instance') instance: NgbTypeahead;
    focusSearchUser$ = new Subject<string>();
    clickSearchUser$ = new Subject<string>();
    todoItemModel: any = {};
    message: any;
    openMessageDetails: any;
    selectedUserDetails: any;
    isSubmitted = false;
    dueTypeList = ["Days", "Months", "Years"];

    myOfficeModel: any = {
        date: "Sunday, Oct 8", horseCount: 12, llamasCount: 22, productCount: 12, openOrderCount: 2, salesLastMonth: 2100,
        offerCount: 2, classifiedCount: 1, auctionCount: 2, activeBidCount: 1,

      
    };
    listingsModel:{ totalclassified:0,totalauction:0,totalbid:0};
    recordModelList:any=[];
    myStoreData:{
        totalitems:0,totalopenorder:0,totalsaleforlastmonth:0
    }
    //End search autocomplete

    constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router
        , public _loaderService: LoaderService, private toaster: ToastrService) {
        //this.events = this.data.getEvents();
    }

    ngOnInit() {
        this.Token = window.localStorage.getItem('token');
        this.Loginuserid = window.localStorage.getItem('id');
        
        this.getMyStoreData();
        this.getListingData();
        this.getRecordData();

    }

    saveTodo(form) {
        this.isSubmitted = false;

        if (form.invalid) {
            this.isSubmitted = true;
            return;
        }
    }

    getMyStoreData() {
        this._loaderService.show();
        this.http.get<any>(config.ServiceUrl + '/api/gateway/GetMyStoreData', this.httpOptions).subscribe(data => {
            this.myStoreData = data;
            this._loaderService.hide();
        });
    }

    getListingData() {
        this._loaderService.show();
        this.http.get<any>(config.ServiceUrl + '/api/gateway/GetTotalClassifiedandauctionandbids', this.httpOptions).subscribe(data => {
            this.listingsModel = data;
            this._loaderService.hide();
        });
    }

    getRecordData() {
        this._loaderService.show();
        this.http.get<any>(config.ServiceUrl + '/api/gateway/GetMyRecordsCountByCategory', this.httpOptions).subscribe(data => {
            this.recordModelList = data;
            this._loaderService.hide();
        });
    }

}
