import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { config } from '../../config/config';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { _ } from 'underscore';
import { DEFAULTIMAGES } from '../../constants/constants';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
    productList: any = [];
    statisticsModel = {
        All: 11,
        Active: 7,
        Drafts: 1,
        SoldOut: 3,
        OpenOrders: 2,
        PastOrders: 0
    };

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        })
    };

    searchModel: any;


    constructor(private http: HttpClient, private router: Router
        , public _loaderService: LoaderService, private toaster: ToastrService) {
        //this.events = this.data.getEvents();
    }

    ngOnInit() {
        this.GetProducts();

    }


    GetProducts() {
        this._loaderService.show();
        this.http.get<any>(config.ServiceUrl + '/api/gateway/GetProducts', this.httpOptions).subscribe(data => {
            this.productList = data;

            this._loaderService.hide();
            this.statisticsModel.All = this.productList.length;
        });
    }

    deleteProduct(id) {
        var result = confirm("Are you sure you want to delete this product?");

        if (result) {
            this._loaderService.show();
            this.http.get<any>(config.ServiceUrl + '/api/gateway/DeleteProductbyId?Pid=' + id, this.httpOptions).subscribe(data => {
                this._loaderService.hide();
                this.GetProducts();
            },
                error => {
                    this._loaderService.hide();
                    this.GetProducts();
                }
            );
        }
    }

    updateProductStatus(id, status) {
        this._loaderService.show();
        this.http.get<any>(config.ServiceUrl + '/api/gateway/UpDateProductStatus?pid=' + id + '&status=' + status, this.httpOptions).subscribe(data => {
            this._loaderService.hide();
            this.GetProducts();
        });
    }

    searchProduct() {
        if (this.searchModel) {
            this._loaderService.show();
            this.http.get<any>(config.ServiceUrl + '/api/gateway/GetProducts?searchtext=' + this.searchModel, this.httpOptions).subscribe(data => {
                this.productList = data;

                this._loaderService.hide();
                this.statisticsModel.All = this.productList.length;
            });
        }
    }
}
