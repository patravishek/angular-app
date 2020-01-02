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
  selector: 'app-storeedit',
  templateUrl: './storeedit.component.html',
  styleUrls: ['./storeedit.component.css']
})
export class StoreEditComponent implements OnInit {
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

  FarmStoreModel: any = {};
  IsSubmit: boolean = false;
  imageChangedEvent: any = '';
  validImage = true;
  public selectedFarmFile: File;
  FarmpreviewPhoto: any;
  imagePath: any = config.imgPath;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router
    , public _loaderService: LoaderService, private toaster: ToastrService) {
    //this.events = this.data.getEvents();
  }

  ngOnInit() {
    this.Token = window.localStorage.getItem('token');
    this.Loginuserid = window.localStorage.getItem('id');
    this.GetFarmStorebyUserID();

  }

  openFarmFileDialogue(event) {
    event.preventDefault();
    let element: HTMLElement = document.getElementById('upload-farm-photo') as HTMLElement;
    element.click();
  }

  public onSelectedFarmFileName(event) {
    this.imageChangedEvent = event;
    this.selectedFarmFile = <File>event.target.files[0];
    this.validImage = true;

    if (this.selectedFarmFile) {
      let extension = this.selectedFarmFile.name.split('.').pop();

      if (extension.toLowerCase() != 'png' && extension.toLowerCase() != 'jpg' && extension.toLowerCase() != 'jpeg') {
        alert("Please upload valid image.");
        this.validImage = false;
        return;
      }
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(this.selectedFarmFile);

    }
  }

  _handleReaderLoaded(readerEvt) {
    this.FarmpreviewPhoto = readerEvt.target.result;
    this.FarmStoreModel.storeLogoFileName = (this.FarmpreviewPhoto.split(',')[1]);
  }

  GetFarmStorebyUserID() {
    this._loaderService.show();
    this.http.get<any>(config.ServiceUrl + '/api/gateway/GetFarmStorebyUserID', this.httpOptions).subscribe(data => {
      this._loaderService.hide();
      this.FarmStoreModel = data;
      if (this.FarmStoreModel && this.FarmStoreModel.storeLogoFileName)
        this.FarmpreviewPhoto = this.imagePath + this.FarmStoreModel.storeLogoFileName;

    },
      error => {
        this._loaderService.hide();
      });
  }

  SaveStore(StoreDetForm) {
    if (StoreDetForm.invalid) {
      this.IsSubmit = true;
      return;
    }
    this._loaderService.show();
    this.http.post(config.ServiceUrl + '/api/gateway/SaveUpdateFarmStore',
      this.FarmStoreModel, this.httpOptions).subscribe(data => {
        this.toaster.success("Farm store saved successfully.");
        this._loaderService.hide();
      },
        error => {
          this._loaderService.hide();
        });
  }
}
