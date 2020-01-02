import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { config } from '../../config/config';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { _ } from 'underscore';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DEFAULTIMAGES } from '../../constants/constants';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { tick } from '@angular/core/testing';
declare var $: any;
import { FarmProfile } from '../../models/farmprofile.model';

@Component({
    selector: 'app-addproduct',
    templateUrl: './addproduct.component.html',
    styleUrls: ['./addproduct.component.css']
})
export class AddProductComponent implements OnInit {
    Loginuserid: any;
    Token: any;
    FoodType: any;
    IsSuccess = false;
    isSubmitted = false;
    productId = 0;
    isAnyAnimalProductTypeSelected = false;
    isAnyAnimalProductSelected = false;
    isAnyRuleSelected = false;
    loggedInUserName = window.localStorage.getItem('name');
    productModel: any = {};
    productDetModel: any = {};
    validFile = true;
    fileName = null;
    awafileName = null;
    awaValidFile = true;
    oragnicCertyFile = null;
    awaFile = null;
    shippingList = [];

    isProductDetSubmitted = false;

    urls = new Array<string>();

    productCategoryList = [];
    animalProductTypeList = [];
    animalProductList = [];


    private connectionIsEstablished = false;
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        })
    };

    constructor(private http: HttpClient, private router: Router
        , public _loaderService: LoaderService, private toaster: ToastrService,
        private activeRouter: ActivatedRoute,
    ) {
        //this.events = this.data.getEvents();
    }

    ngOnInit() {
        this.Token = window.localStorage.getItem('token');
        this.Loginuserid = window.localStorage.getItem('id');
        this.productModel = {
            IsNonGMO: "true",
            IsGrainCorn: "true",
            Isherbicides: "true"
        };

        this.productDetModel = {
            shipingTypeId: "",
            prodCatId: "",
            productPhotoModel: []

        };

        this.GetCertificateNameList();
        this.GetShippingtype();
        this.GetProductCategory();

        this.activeRouter.params.subscribe(params => {
            this.productId = params['id'];

            if (this.productId > 0)
                this.getProductDetails();
        });
    }

    FoodTypeDet(type) {
        this.FoodType = type;

        if (this.productId == 0)
            this.urls = [];
    }

    saveProduct(form) {
        this.isSubmitted = false;

        this.isAnyAnimalProductTypeSelected = true;
        this.isAnyAnimalProductSelected = true;
        this.isAnyRuleSelected = true;

        if (form.invalid) {
            this.isSubmitted = true;
            return;
        }

        if (!this.animalProductTypeList.some(function (item: any) { return item.isSelected; })) {
            this.isAnyAnimalProductTypeSelected = false;
            this.isSubmitted = true;
        }

        if (!this.animalProductList.some(function (item: any) { return item.isSelected; })) {
            this.isSubmitted = true;
            this.isAnyAnimalProductSelected = false;
        }

        if (!this.productModel.IsStatePolicy || !this.productModel.IsUSDAPolicy) {
            this.isAnyRuleSelected = false;
            this.isSubmitted = true;
        }

        var animalProductTypeList = _.filter(this.animalProductTypeList, function (obj) {
            return obj.isSelected == true;
        });

        var animalProductList = _.filter(this.animalProductList, function (obj) {
            return obj.isSelected == true;
        });

        if (animalProductTypeList.length > 0)
            this.productModel.Producttype = _.pluck(animalProductTypeList, 'id').join(',');

        if (animalProductList.length > 0)
            this.productModel.certificateType = _.pluck(animalProductList, 'id').join(',');


        if (this.isSubmitted)
            return;

        this._loaderService.show();
        this.http.post(config.ServiceUrl + '/api/gateway/AddUpdateuSDAFormInfo', this.productModel, this.httpOptions).subscribe(data => {
            this.toaster.success("Product added successfully.");
            this._loaderService.hide();

        },
            error => {
                this._loaderService.hide();
            });
    }

    openOrganicCertificateFileDialogue(event) {
        event.preventDefault();
        let element: HTMLElement = document.getElementById('photoOrganicCerty') as HTMLElement;
        element.click();
    }

    openAWAFileDialogue(event) {
        event.preventDefault();
        let element: HTMLElement = document.getElementById('photoAWA') as HTMLElement;
        element.click();
    }

    onSelectedOrganicCertificateFileName(event) {
        var selectedFile = <File>event.target.files[0];

        if (selectedFile) {
            let extension = selectedFile.name.split('.').pop();

            if (extension.toLowerCase() != 'png' && extension.toLowerCase() != 'jpg' && extension.toLowerCase() != 'jpeg' &&
                extension.toLowerCase() != 'doc' && extension.toLowerCase() != 'docx' && extension.toLowerCase() != 'pdf') {
                this.toaster.error("Please upload valid organic certificate file.");
                this.validFile = false;
                return;
            }
            this.fileName = selectedFile.name;
            this.validFile = true;
            this.oragnicCertyFile = selectedFile;

            var reader = new FileReader();
            reader.onload = this._handleOrganicCertificateReaderLoaded.bind(this);
            reader.readAsDataURL(this.oragnicCertyFile);
        }
    }

    _handleOrganicCertificateReaderLoaded(readerEvt) {
        this.productModel.organiccertificatename = readerEvt.target.result.split(',')[1];;
    }

    onSelectedAWAFileName(event) {
        var selectedFile = <File>event.target.files[0];

        if (!selectedFile) {
            this.toaster.error("Please upload valid certificate file.");
        }
        let extension = selectedFile.name.split('.').pop();

        if (extension.toLowerCase() != 'png' && extension.toLowerCase() != 'jpg' && extension.toLowerCase() != 'jpeg' &&
            extension.toLowerCase() != 'doc' && extension.toLowerCase() != 'docx' && extension.toLowerCase() != 'pdf') {

            this.awaValidFile = false;
            return;
        }
        this.awafileName = selectedFile.name;
        this.awaValidFile = true;
        this.awaFile = selectedFile;
        var reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(this.awaFile);
    }

    _handleReaderLoaded(readerEvt) {
        this.productModel.AWAcertificatename = readerEvt.target.result.split(',')[1];

    }

    saveProductDet(form) {
        if (form.invalid) {
            this.isProductDetSubmitted = true;
            return;
        }

        this.isProductDetSubmitted = false;

        this._loaderService.show();

        this.http.post(config.ServiceUrl + '/api/gateway/SaveUpdateproducts',
            this.productDetModel, this.httpOptions).subscribe(data => {
                this.toaster.success("Product saved successfully.");
                this.router.navigate(['/product']);
                this._loaderService.hide();
            },
                error => {
                    this._loaderService.hide();
                });
    }

    UploadImages(event) {

        let files = event.target.files;
        if (files) {
            for (let file of files) {
                let reader = new FileReader();
                reader.onload = (e: any) => {
                    this.urls.push(e.target.result);
                    this.productDetModel.productPhotoModel.push({ fileName: e.target.result.split(',')[1] });

                }
                reader.readAsDataURL(file);
            }
        }
    }

    RemoveImage(id) {
        this.urls.splice(id, 1);
        this.productDetModel.productPhotoModel.splice(id, 1);
    }

    GetCertificateNameList() {
        this.http.get<any>(config.ServiceUrl + '/api/gateway/GetUSDAFormFarmNameWithProducttype?userId=' + this.Loginuserid, this.httpOptions).subscribe(data => {
            this.productModel.Name = data.userfullname;
            this.productModel.farmName = data.farmName;
            this.animalProductTypeList = data.productTypeModels;
            this.animalProductList = data.certificateTypeModels;

        });
    }

    GetShippingtype() {
        this.http.get<any>(config.ServiceUrl + '/api/gateway/GetShippingtype', this.httpOptions).subscribe(data => {
            this.shippingList = data;
        });
    }

    GetProductCategory() {
        this.http.get<any>(config.ServiceUrl + '/api/gateway/GetProductCategory', this.httpOptions).subscribe(data => {
            this.productCategoryList = data;
        });
    }

    getProductDetails() {
        this._loaderService.show();
        this.http.get<any>(config.ServiceUrl + '/api/gateway/GetProductbyId?Pid=' + this.productId, this.httpOptions).subscribe(data => {
            this._loaderService.hide();
            this.productDetModel = data;
            this.urls = this.urls.concat(this.productDetModel.productPhotoModel.map(function (item) { return config.imgPath + item.fileName }));
        });
    }
}
