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
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
    Loginuserid: any;
    Token: any;
    userList: any;
    userMessageList: any;
    states = [];
    classifiedDetList = [
        // { id: 1, breedLiveStockName: "Item One", imgUrl: "http://placehold.it/700x400", price: 24.99, breedName: "Altai Mountain ", gender: "Gelding", dob: new Date().setFullYear(1985), age: 32, height: "111", sellerName: "Seller Name", sellerAddress: "Place, ST" },
        // { id: 2, breedLiveStockName: "Item One", imgUrl: "http://placehold.it/700x400", price: 24.99, breedName: "Altai Mountain ", gender: "Gelding", dob: new Date(), age: 32, height: "111", sellerName: "Seller Name", sellerAddress: "Place, ST" },
        // { id: 3, breedLiveStockName: "Item One", imgUrl: "http://placehold.it/700x400", price: 24.99, breedName: "Altai Mountain ", gender: "Gelding", dob: new Date(), age: 32, height: "111", sellerName: "Seller Name", sellerAddress: "Place, ST" },
        // { id: 4, breedLiveStockName: "Item One", imgUrl: "http://placehold.it/700x400", price: 24.99, breedName: "Altai Mountain ", gender: "Gelding", dob: new Date(), age: 32, height: "111", sellerName: "Seller Name", sellerAddress: "Place, ST" },
        // { id: 5, breedLiveStockName: "Item One", imgUrl: "http://placehold.it/700x400", price: 24.99, breedName: "Altai Mountain ", gender: "Gelding", dob: new Date(), age: 32, height: "111", sellerName: "Seller Name", sellerAddress: "Place, ST" },
        // { id: 6, breedLiveStockName: "Item One", imgUrl: "http://placehold.it/700x400", price: 24.99, breedName: "Altai Mountain ", gender: "Gelding", dob: new Date(), age: 32, height: "111", sellerName: "Seller Name", sellerAddress: "Place, ST" }
    ];
    classifiedList = [
        // { id: "1", name: "Cattle" },
        // { id: "2", name: "Goat" },
        // { id: "3", name: "Sheep" },
        // { id: "4", name: "Horse" },
        // { id: "5", name: "Swine" },
        // { id: "6", name: "Llama" },
        // { id: "7", name: "Alpaca" },
        // { id: "8", name: "Other" }
    ];
    nonLiveStockCateist = [
        // { id: "1", name: "Farm Equipment" },
        // { id: "2", name: "Farm Vehicles" },
        // { id: "3", name: "Hay" },
        // { id: "4", name: "Livestock Semen" },
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
    selectedUserDetails: any;
    searchModel: any = {};
    //End search autocomplete

    constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router
        , public _loaderService: LoaderService, private toaster: ToastrService) {
        //this.events = this.data.getEvents();
    }

    ngOnInit() {
        this.Token = window.localStorage.getItem('token');
        this.Loginuserid = window.localStorage.getItem('id');
        this.getStates();
        this.getClassifiedList();
        this.getAnimalTypes();
    }

    getStates() {
        this._loaderService.show();
        this.http.get(config.ServiceUrl + '/api/gateway/GetStates', this.httpOptions).subscribe((data: any) => {
            this.states = data;
            this._loaderService.hide();
        });
    }

    getAnimalTypes() {
        this.http.get(config.ServiceUrl + '/api/gateway/GetAnimaltypes', this.httpOptions).subscribe((data: any) => {
            this.classifiedList = data;
        });
    }

    getClassifiedList() {
        this._loaderService.show();
        this.http.get(config.ServiceUrl + '/api/gateway/GetClassfiedItemListForSale?Searchtext=' + this.searchModel.searchText + '', this.httpOptions).subscribe((data: any) => {
            this.classifiedDetList = data;
            this._loaderService.hide();
        }, err => {
            this._loaderService.hide();
        }
        );
    }
}
