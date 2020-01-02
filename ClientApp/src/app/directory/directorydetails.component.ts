import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { config } from '../../config/config';
import * as moment from 'moment';
import { _ } from 'underscore';
import { ShareButtons } from '@ngx-share/core';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-directory-page',
  templateUrl: './directorydetails.component.html'
})

export class DirectoryDetailsComponent implements OnInit {
  directoryID: any;
  animalTypes = [{ id: null, name: 'Select One' }];
  states = [{ id: null, name: 'Select One' }];
  breeds = [{ id: null, name: 'Select One' }];
  filters = {};
  searchText = "";
  searchModel: any = { state: null, animalType: null, breed: null, farmName: null };
  directoryDetail = [];
  rootImgPath: any = config.imgPath;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    })
  };

  loggedInUserId = localStorage.getItem('id');
  constructor(private http: HttpClient, private router: ActivatedRoute
    , public _loaderService: LoaderService, public share: ShareButtons, private toaster: ToastrService
    , private formBuilder: FormBuilder) {
    this.router.params.subscribe(params => {
      this.directoryID = params['id'];
    })
  }
  ngOnInit() {
    this.getDirectoryDet();
    this.getAnimalTypes();
    this.getStates();

  }

  getDirectoryDet() {
    this._loaderService.show();
    this.http.get(config.ServiceUrl + '/api/gateway/GetDirectoryDeatils?catgoryname=' + this.directoryID + '&state=' + (this.searchModel.state == null ? 1 : this.searchModel.state) + '&animaltype=' + (this.searchModel.animalType == null ? 1 : this.searchModel.animalType) + '&breedid=' + (this.searchModel.breed == null ? 1 : this.searchModel.breed) + '&farmname=' + this.searchModel.farmName, this.httpOptions).subscribe((data: any) => {
      this.directoryDetail = data;
      this._loaderService.hide();
    });
  }

  getAnimalTypes() {
    this._loaderService.show();
    this.http.get(config.ServiceUrl + '/api/gateway/GetAnimaltypes', this.httpOptions).subscribe((data: any) => {
      this.animalTypes = data;
      this.animalTypes.push({ id: null, name: 'Select One' });
      this._loaderService.hide();
    });
  }

  getStates() {
    this._loaderService.show();
    this.http.get(config.ServiceUrl + '/api/gateway/GetStates', this.httpOptions).subscribe((data: any) => {
      this.states = data;
      this.states.push({ id: null, name: 'Select One' });
      this._loaderService.hide();
    });
  }

  getBreeds(animalTypeId) {
    this.breeds = [{ id: null, name: 'Select One' }];
    this.searchModel.breed = null;
    
    if (animalTypeId > 0) {
      this._loaderService.show();
      this.http.get(config.ServiceUrl + '/api/gateway/GetBreeds?animaltypeId=' + animalTypeId, this.httpOptions).subscribe((data: any) => {
        this.breeds = data;
        this.breeds.push({ id: null, name: 'Select One' });
        this._loaderService.hide();
      }, error => {
        this._loaderService.hide();
      });
    }
  }

  search() {
    this.getDirectoryDet();
  }
}