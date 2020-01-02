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
    selector: 'app-farmstore',
    templateUrl: './farmstore.component.html',
    styleUrls: ['./farmstore.component.css']
})
export class FarmStoreComponent implements OnInit {
    rootImagePath =  config.imgPath;
    Loginuserid: any;
    Token: any;
    userList: any;
    states = [];
    userMessageList: any;
    dairyProductList = [
        { id: "1", name: "Breef" },
        { id: "2", name: "Pork" },
        { id: "3", name: "Poultry" },
        { id: "4", name: "Dairy" },
        { id: "5", name: "Woll,Yarn & Clothing" }
    ];
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
    message: any;
    openMessageDetails: any;
    imgUrl = "http://placehold.it/700x400";
    farmStoreList = [
        // { id: 1, name: "Item One", price: 24.99, breed: "Altai Mountain", gender: "Gelding", dob: new Date().setFullYear(1985), age: 32, height: 111111, sellerName: "Seller Name", location: "Place, ST", imgUrl: "http://placehold.it/700x400" },
        // { id: 2, name: "Item One", price: 24.99, breed: "Altai Mountain", gender: "Gelding", dob: new Date().setFullYear(1985), age: 32, height: 111111, sellerName: "Seller Name", location: "Place, ST", imgUrl: "http://placehold.it/700x400" },
        // { id: 3, name: "Item One", price: 24.99, breed: "Altai Mountain", gender: "Gelding", dob: new Date().setFullYear(1985), age: 32, height: 111111, sellerName: "Seller Name", location: "Place, ST", imgUrl: "http://placehold.it/700x400" },
        // { id: 4, name: "Item One", price: 24.99, breed: "Altai Mountain", gender: "Gelding", dob: new Date().setFullYear(1985), age: 32, height: 111111, sellerName: "Seller Name", location: "Place, ST", imgUrl: "http://placehold.it/700x400" },
        // { id: 5, name: "Item One", price: 24.99, breed: "Altai Mountain", gender: "Gelding", dob: new Date().setFullYear(1985), age: 32, height: 111111, sellerName: "Seller Name", location: "Place, ST", imgUrl: "http://placehold.it/700x400" },
        // { id: 6, name: "Item One", price: 24.99, breed: "Altai Mountain", gender: "Gelding", dob: new Date().setFullYear(1985), age: 32, height: 111111, sellerName: "Seller Name", location: "Place, ST", imgUrl: "http://placehold.it/700x400" },
    ]
    selectedUserDetails: any;
    searchText="";
    //End search autocomplete

    constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router
        , public _loaderService: LoaderService, private toaster: ToastrService) {
        //this.events = this.data.getEvents();
    }

    ngOnInit() {
        this.Token = window.localStorage.getItem('token');
        this.Loginuserid = window.localStorage.getItem('id');

        this.getStates();
        this.getFarmStores();
    }

    getStates() {
        this._loaderService.show();
        this.http.get(config.ServiceUrl + '/api/gateway/GetStates', this.httpOptions).subscribe((data: any) => {
            this.states = data;
            this._loaderService.hide();
        });
    }

    getFarmStores() {
        this._loaderService.show();
        this.http.get(config.ServiceUrl + '/api/gateway/GetFarmStoreProducts?searchtext='+ this.searchText +'', this.httpOptions).subscribe((data: any) => {
            this.farmStoreList = data;
            this._loaderService.hide();
        },err=>{
            this._loaderService.hide();
        }
        );
    }
}
