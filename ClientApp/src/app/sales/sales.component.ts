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
    selector: 'app-sales',
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
    Loginuserid: any;
    Token: any;
    searchText = "";
    saleList: any = [
        { id: 1, productName: "Product Name", productCategory: "Product Category", soldDate: new Date(17, 10, 6), shippingOption: "Shipping Option", referenceNo: "12345", totalAmountPaid: 60.00, buyerName: "Buyer Name" },
        { id: 2, productName: "Product Name", productCategory: "Product Category", soldDate: new Date(17, 10, 6), shippingOption: "Shipping Option", referenceNo: "12345", totalAmountPaid: 60.00, buyerName: "Buyer Name" },
        { id: 3, productName: "Product Name", productCategory: "Product Category", soldDate: new Date(17, 10, 6), shippingOption: "Shipping Option", referenceNo: "12345", totalAmountPaid: 60.00, buyerName: "Buyer Name" },
        { id: 4, productName: "Product Name", productCategory: "Product Category", soldDate: new Date(17, 10, 6), shippingOption: "Shipping Option", referenceNo: "12345", totalAmountPaid: 60.00, buyerName: "Buyer Name" },
    ];
    userMessageList: any;

    statisticsModel = {
        All: 11,
        Active: 7,
        Drafts: 1,
        SoldOut: 3,
        OpenOrders: 2,
        PastOrders: 0
    };

    private connectionIsEstablished = false;
    public _hubConnection: HubConnection;
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        })
    };

    //Search autocomplete
    @ViewChild('instance') instance: NgbTypeahead;
    focusSearchUser$ = new Subject<string>();
    clickSearchUser$ = new Subject<string>();
    message: any;
    openMessageDetails: any;
    selectedUserDetails: any;
    //End search autocomplete

    constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router
        , public _loaderService: LoaderService, private toaster: ToastrService) {
        //this.events = this.data.getEvents();
    }

    ngOnInit() {
        this.Token = window.localStorage.getItem('token');
        this.Loginuserid = window.localStorage.getItem('id');

        this.getSales();
    }

    getSales() {
        this._loaderService.show();
        this.http.get<any>(config.ServiceUrl + '/api/gateway/GetSalesOrder', this.httpOptions).subscribe(data => {
            this.saleList = data;
            this._loaderService.hide();
        });
    }

    search() {
        this._loaderService.show();
        this.http.get<any>(config.ServiceUrl + '/api/gateway/GetSalesOrder?serachtxt='+this.searchText, this.httpOptions).subscribe(data => {
            this.saleList = data;
            this._loaderService.hide();
        });
    }
}
