import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { config } from '../../config/config';
import { Router, RouterState } from '@angular/router';
import { debug } from 'util';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { _ } from 'underscore';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-hert',
  templateUrl: './hert.component.html',
  styleUrls: ['./hert.component.css']
})
export class HertComponent implements OnInit {
  HerdRecordList: any = [];
  isAnyHerdRecordSelected = false;
  heardHealthIssueModel: any = {};
  heardHealthRecordModel: any = {};
  heardHealthShowRecordModel: any = {};
  herdBreedRecordModel: any = {};
  bsConfig: Partial<BsDatepickerConfig>;
  isSubmitted = false;
  IsSubmitedHealthRecord = false;
  isSubmittedShowRecord = false;
  isSubmittedbreedingrecords = false;
  isListView = false;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    })
  };
  rootImgPath: any = config.imgPath;
  SearchModel: any = {
    sortorder: "ASC",
    searchtxt: ""
  };
  IsAsc: any = true;
  herdMasterId: any = [];
  constructor(private _httpClient: HttpClient, public _loaderService: LoaderService, private router: Router,
    private toaster: ToastrService) { }

  ngOnInit() {
    this.GetHerdRecordsList();
  }

  GetHerdRecordsList() {

    this._loaderService.show();
    this._httpClient.get(config.ServiceUrl + '/api/Gateway/GetHerdRecords?searchtxt=' + this.SearchModel.searchtxt + "&sortorder=" + this.SearchModel.sortorder, this.httpOptions).subscribe(data => {
      this._loaderService.hide();
      this.HerdRecordList = data;
    }, error => {
      this._loaderService.hide();
    });
  }

  EditHertDetail(item) {
    if (item && item.id)
      this.router.navigate(['/herd/AddEdit/' + item.id]);
  }

  Sorting(sortType) {
    this.SearchModel.sortorder = sortType;

    if (this.SearchModel && this.SearchModel.sortorder == 'ASC')
      this.IsAsc = false
    else if (this.SearchModel && this.SearchModel.sortorder == 'DESC')
      this.IsAsc = true

    this.GetHerdRecordsList();
  }

  selectHerdRecord(item) {
    item.IsSelected = !item.IsSelected;
    this.isAnyHerdRecordSelected = this.HerdRecordList.some(function (obj) { return item.IsSelected; });
  }

  selectHerdRow(item) {
    if (this.isListView) {
      item.IsSelected = !item.IsSelected;
      this.isAnyHerdRecordSelected = this.HerdRecordList.some(function (obj) { return item.IsSelected; });
    }
  }
  selectUnSelectAll(isSelect) {
    var herdRecordList = this.HerdRecordList;
    herdRecordList.forEach(item => {
      item.IsSelected = isSelect;
    });
  }

  saveHealthIssue(healthIssuesForm) {
    if (healthIssuesForm.invalid) {
      this.isSubmitted = true;
      return;
    }

    this._loaderService.show();
    var ids = _.filter(this.HerdRecordList, function (obj) {
      return obj.IsSelected == true;
    });
    var data = {
      heardHealthIssueModel: this.heardHealthIssueModel,
      heardHealthRecordModel: {},
      heardHealthShowRecordModel: {},
      herdBreedRecordModel: {},
      herdMasterId: _.pluck(ids, 'id')
    };

    this._httpClient.post(config.ServiceUrl + '/api/Gateway/SaveUpdateHeardBulk', JSON.stringify(data), this.httpOptions).subscribe(data => {
      this._loaderService.hide();
      this.GetHerdRecordsList();
      this.heardHealthIssueModel = {};
      $("#healthIssues").hide();
      $(".modal-backdrop").hide();
      this.toaster.success("Success", "Health issue detail save successfully.");
      this.isAnyHerdRecordSelected = false;
    }, error => {
      this._loaderService.hide();
    });
  }

  ClearHealthIssue() {
    this.heardHealthIssueModel = {};
  }

  //clear HealthRecord
  ClearHealtRecord() {
    this.heardHealthRecordModel = {};
  }

  ClearHealthShowRecord() {
    this.heardHealthShowRecordModel = {};
  }

  ClearBreedRecordModel() {
    this.herdBreedRecordModel = {};
  }

  //Health record
  saveHealthRecord(healthRecordForm) {
    if (healthRecordForm.invalid) {
      this.IsSubmitedHealthRecord = true;
      return;
    }

    this._loaderService.show();
    var ids = _.filter(this.HerdRecordList, function (obj) {
      return obj.IsSelected == true;
    });
    var data = {
      heardHealthIssueModel: {},
      herdMasterId: _.pluck(ids, 'id'),
      heardHealthRecordModel: this.heardHealthRecordModel,
      heardHealthShowRecordModel: {},
      herdBreedRecordModel: {}

    };

    this._httpClient.post(config.ServiceUrl + '/api/Gateway/SaveUpdateHeardBulk', JSON.stringify(data), this.httpOptions).subscribe(data => {
      this._loaderService.hide();
      this.GetHerdRecordsList();
      this.heardHealthRecordModel = {};

      $("#healthRecords").hide();
      $(".modal-backdrop").hide();
      this.toaster.success("Success", "Health record detail save successfully.");
      this.isAnyHerdRecordSelected = false;
    }, error => {
      this._loaderService.hide();
    });
  }

  saveShowRecord(showRecordForm) {
    if (showRecordForm.invalid) {
      this.isSubmittedShowRecord = true;
      return;
    }

    this._loaderService.show();
    var ids = _.filter(this.HerdRecordList, function (obj) {
      return obj.IsSelected == true;
    });
    var data = {
      heardHealthIssueModel: {},
      herdMasterId: _.pluck(ids, 'id'),
      heardHealthRecordModel: {},
      heardHealthShowRecordModel: this.heardHealthShowRecordModel,
      herdBreedRecordModel: {}
    };
    this._httpClient.post(config.ServiceUrl + '/api/Gateway/SaveUpdateHeardBulk', JSON.stringify(data), this.httpOptions).subscribe(data => {
      this._loaderService.hide();
      this.GetHerdRecordsList();
      this.heardHealthShowRecordModel = {};
      $("#showRecords").hide();
      $(".modal-backdrop").hide();
      this.toaster.success("Success", "Show record detail save successfully.");
      this.isAnyHerdRecordSelected = false;
    }, error => {
      this._loaderService.hide();
    });
  }

  saveBreedingRecord(breedRecordForm) {
    if (breedRecordForm.invalid) {
      this.isSubmittedbreedingrecords = true;
      return;
    }

    this._loaderService.show();
    var ids = _.filter(this.HerdRecordList, function (obj) {
      return obj.IsSelected == true;
    });
    var data = {
      heardHealthIssueModel: {},
      herdMasterId: _.pluck(ids, 'id'),
      heardHealthRecordModel: {},
      heardHealthShowRecordModel: {},
      herdBreedRecordModel: this.herdBreedRecordModel,

    };

    this._httpClient.post(config.ServiceUrl + '/api/Gateway/SaveUpdateHeardBulk', JSON.stringify(data), this.httpOptions).subscribe(data => {
      this._loaderService.hide();
      $("#breedRecords").hide();
      $(".modal-backdrop").hide();
      this.GetHerdRecordsList();
      this.herdBreedRecordModel = {};
      this.toaster.success("Success", "Breed detail save successfully.");
      this.isAnyHerdRecordSelected = false;
    }, error => {
      this._loaderService.hide();
    });
  }
}
