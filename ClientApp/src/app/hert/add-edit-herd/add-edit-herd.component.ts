import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../services/loader.service';
import { config } from '../../../config/config';
import { _ } from 'underscore';
import { debug } from 'util';

@Component({
  selector: 'app-add-edit-herd',
  templateUrl: './add-edit-herd.component.html',
  styleUrls: ['./add-edit-herd.component.css']
})
export class AddEditHerdComponent implements OnInit {
  bsConfig: Partial<BsDatepickerConfig>;
  public ProfileselectedFile: File;
  public RegistrationselectedFile: File;
  public AdditionalPhotoselectedFile: File;
  HerdMasterWrapperModel: any = {
    heardmasterModel: {},
    heardHealthIssueModel: [],
    heardHealthRecordModel: [],
    heardHealthShowRecordModel: [],
    herdBreedRecordModel: [],
    herdIdDetailsModel: {},
    heardIdAddtionalPhotoModelList: {
      heardIdAddtionalPhotoModels: []
    }

  }

  heardHealthIssueModel: any = {
    healthIssueId: 0
  };
  heardHealthRecordModel: any = {
    healthRecordId: 0
  };
  heardHealthShowRecordModel: any = {
    healthShowRecordId: 0
  };
  herdBreedRecordModel: any = {
    breadRecordId: 0
  }


  HertManagementId: any;
  isSubmitted: any = false;
  isSubmittedShowRecord: any = false;
  isSubmittedbreedingrecords: any = false;
  IsSubmit: any = false;
  IsSubmitedHealthRecord: any = false;
  validImage = true;
  previewPhoto = 'http://via.placeholder.com/600x400';
  HeratImage: any;
  base64: any = "data:image/jpeg;base64,"
  rootImgPath: any = config.imgPath;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    })
  };


  animalTypes = [];
  breeds = [];

  constructor(private _httpClient: HttpClient, private router: Router, public _loaderService: LoaderService,
    private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.params.subscribe(params => {

      if (params && params.Id) {
        this.HertManagementId = params.Id;
        if (this.HertManagementId > 0)
          this.GetHeartManagementDetailByID(this.HertManagementId);
        else {
          this.GetAnimalId();
          //this.HerdMasterWrapperModel.herdIdDetailsModel.idNumber = Math.floor(1000 + Math.random() * 9000);
          //this.randomStringId(8, '0123456789')
        }

      }
    });
    this.getAnimalTypes();
  }

  GetHeartManagementDetailByID(Id) {
    this._loaderService.show();
    this._httpClient.get(config.ServiceUrl + '/api/Gateway/GetHerdRecordById?Id=' + Id, this.httpOptions).subscribe(data => {
      this._loaderService.hide();
      this.HerdMasterWrapperModel = data;
      if (this.HerdMasterWrapperModel.heardmasterModel.type)
        this.getBreeds(this.HerdMasterWrapperModel.heardmasterModel.type)

      if (this.HerdMasterWrapperModel && this.HerdMasterWrapperModel.heardmasterModel && this.HerdMasterWrapperModel.heardmasterModel.dob)
        this.HerdMasterWrapperModel.heardmasterModel.dob = new Date(this.HerdMasterWrapperModel.heardmasterModel.dob);

      if (this.HerdMasterWrapperModel && this.HerdMasterWrapperModel.heardHealthIssueModel && this.HerdMasterWrapperModel.heardHealthIssueModel.healthDate)
        this.HerdMasterWrapperModel.heardHealthIssueModel.healthDate = new Date(this.HerdMasterWrapperModel.heardHealthIssueModel.healthDate);

      if (this.HerdMasterWrapperModel && this.HerdMasterWrapperModel.heardHealthShowRecordModel && this.HerdMasterWrapperModel.heardHealthShowRecordModel.showRecordDate)
        this.HerdMasterWrapperModel.heardHealthShowRecordModel.showRecordDate = new Date(this.HerdMasterWrapperModel.heardHealthShowRecordModel.showRecordDate);

      if (this.HerdMasterWrapperModel && this.HerdMasterWrapperModel.herdBreedRecordModel && this.HerdMasterWrapperModel.herdBreedRecordModel.breadDate)
        this.HerdMasterWrapperModel.herdBreedRecordModel.breadDate = new Date(this.HerdMasterWrapperModel.herdBreedRecordModel.breadDate);

      if (this.HerdMasterWrapperModel && this.HerdMasterWrapperModel.heardHealthRecordModel && this.HerdMasterWrapperModel.heardHealthRecordModel.recordDate)
        this.HerdMasterWrapperModel.heardHealthRecordModel.recordDate = new Date(this.HerdMasterWrapperModel.heardHealthRecordModel.recordDate);
    }, error => {
      this._loaderService.hide();
    });
  }

  AddHealthIssue(healthIssuesForm) {
    if (healthIssuesForm.invalid) {
      this.isSubmitted = true;
      return;
    }

    $("#healthIssues").hide();
    $(".modal-backdrop").hide();



    var heardHealthIssueModel = this.heardHealthIssueModel;

    if (heardHealthIssueModel.currentIndex > -1) {
      this.HerdMasterWrapperModel.heardHealthIssueModel[heardHealthIssueModel.currentIndex] = heardHealthIssueModel;
    }
    else {
      this.HerdMasterWrapperModel.heardHealthIssueModel.push(heardHealthIssueModel);
      var index = this.HerdMasterWrapperModel.heardHealthIssueModel.indexOf(heardHealthIssueModel);
      heardHealthIssueModel.currentIndex = index;
    }
    this.heardHealthIssueModel = {};
  }

  Addshowrecords(showrecordsForm) {
    if (showrecordsForm.invalid) {
      this.isSubmittedShowRecord = true;
      return;
    }
    $("#showRecords").hide();
    $(".modal-backdrop").hide();

    var heardHealthShowRecordModel = this.heardHealthShowRecordModel;

    if (heardHealthShowRecordModel.currentIndex > -1) {
      this.HerdMasterWrapperModel.heardHealthShowRecordModel[heardHealthShowRecordModel.currentIndex] = heardHealthShowRecordModel;
    }
    else {
      this.HerdMasterWrapperModel.heardHealthShowRecordModel.push(heardHealthShowRecordModel);
      var index = this.HerdMasterWrapperModel.heardHealthShowRecordModel.indexOf(heardHealthShowRecordModel);
      heardHealthShowRecordModel.currentIndex = index;
    }
    //this.HerdMasterWrapperModel.heardHealthShowRecordModel.push(this.heardHealthShowRecordModel);
    this.heardHealthShowRecordModel = {};
  }

  Addbreedingrecord(showrecordsForm) {
    if (showrecordsForm.invalid) {
      this.isSubmittedbreedingrecords = true;
      return;
    }
    $("#breedRecords").hide();
    $(".modal-backdrop").hide();

    //  this.HerdMasterWrapperModel.herdBreedRecordModel.push(this.herdBreedRecordModel);
    var herdBreedRecordModel = this.herdBreedRecordModel;

    if (herdBreedRecordModel.currentIndex > -1) {
      this.HerdMasterWrapperModel.herdBreedRecordModel[herdBreedRecordModel.currentIndex] = herdBreedRecordModel;
    }
    else {
      this.HerdMasterWrapperModel.herdBreedRecordModel.push(herdBreedRecordModel);
      var index = this.HerdMasterWrapperModel.herdBreedRecordModel.indexOf(herdBreedRecordModel);
      herdBreedRecordModel.currentIndex = index;
    }

    this.herdBreedRecordModel = {};
  }

  AddHealthRecord(healthRecordForm) {
    if (healthRecordForm.invalid) {
      this.IsSubmitedHealthRecord = true;
      return;
    }
    $("#healthRecords").hide();
    $(".modal-backdrop").hide();
    // this.HerdMasterWrapperModel.heardHealthRecordModel.push(this.heardHealthRecordModel);
    var heardHealthRecordModel = this.heardHealthRecordModel;

    if (heardHealthRecordModel.currentIndex > -1) {
      this.HerdMasterWrapperModel.heardHealthRecordModel[heardHealthRecordModel.currentIndex] = heardHealthRecordModel;
    }
    else {
      this.HerdMasterWrapperModel.heardHealthRecordModel.push(heardHealthRecordModel);
      var index = this.HerdMasterWrapperModel.heardHealthRecordModel.indexOf(heardHealthRecordModel);
      heardHealthRecordModel.currentIndex = index;
    }

    this.heardHealthRecordModel = {};
  }

  deleteHealthIssue(index) {
    this.HerdMasterWrapperModel.heardHealthIssueModel.splice(index, 1);
  }

  deleteHealthRecord(index) {
    this.HerdMasterWrapperModel.heardHealthRecordModel.splice(index, 1);
  }

  deleteShowRecord(index) {
    this.HerdMasterWrapperModel.heardHealthShowRecordModel.splice(index, 1);
  }

  deleteBreedRecord(index) {
    this.HerdMasterWrapperModel.herdBreedRecordModel.splice(index, 1);
  }

  SaveHertManagementDet(HertManagementForm) {
    if (HertManagementForm.invalid) {
      this.IsSubmit = true;
      return;
    }

    if (this.HerdMasterWrapperModel.herdIdDetailsModel.RegCertfileContent)
      this.HerdMasterWrapperModel.herdIdDetailsModel.RegCertfileContent = this.HerdMasterWrapperModel.herdIdDetailsModel.RegCertfileContent.split(',')[1];

    if (this.HerdMasterWrapperModel.heardmasterModel.HerdProfilePic)
      this.HerdMasterWrapperModel.heardmasterModel.HerdProfilePic = this.HerdMasterWrapperModel.heardmasterModel.HerdProfilePic.split(',')[1];
    this._loaderService.show();

    this._httpClient.post(config.ServiceUrl + '/api/Gateway/SaveUpdateHeardWrapper', JSON.stringify(this.HerdMasterWrapperModel), this.httpOptions).subscribe(data => {
      this._loaderService.hide();
      this.router.navigate(['/herd']);
    }, error => {
      this._loaderService.hide();
    });

  }

  //certficicateUpload
  public RegistrationonSelectedFileName(event) {
    this.RegistrationselectedFile = <File>event.target.files[0];

    if (this.RegistrationselectedFile) {
      this.HerdMasterWrapperModel.herdIdDetailsModel.regCertfileName = this.RegistrationselectedFile.name;
      this.RegistrationreadURL();
    }
  }

  //preview image after upload image
  RegistrationreadURL() {
    var reader = new FileReader();
    let parentThis = this;

    var reader = new FileReader();
    reader.onload = this._RegistrationhandleReaderLoaded.bind(this);
    //reader.readAsBinaryString(this.selectedFile);
    reader.readAsDataURL(parentThis.RegistrationselectedFile);
  }

  _RegistrationhandleReaderLoaded(readerEvt) {
    this.HerdMasterWrapperModel.herdIdDetailsModel.RegCertfileContent = readerEvt.target.result;
    //this.post.PostImgstr.push((this.previewPhoto.split(',')[1]));
  }

  public RegistrationopenfileDialogue(event) {
    event.preventDefault();
    let element: HTMLElement = document.getElementById('photoUpdate') as HTMLElement;
    element.click();
  }

  //Hert Profile Upload
  public ProfileonSelectedFileName(event) {
    this.ProfileselectedFile = <File>event.target.files[0];
    let extension = this.ProfileselectedFile.name.split('.').pop();

    if (extension.toLowerCase() != 'png' && extension.toLowerCase() != 'jpg' && extension.toLowerCase() != 'jpeg') {
      // this.fileErrorMsg = MESSAGES.UPLOADFILEVALIDATION;
      alert("Please upload valid image.");
      this.validImage = false;
    }
    if (this.ProfileselectedFile) {
      this.ProfilereadURL();
    }
  }

  //preview image after upload image
  ProfilereadURL() {
    var reader = new FileReader();
    let parentThis = this;

    var reader = new FileReader();
    reader.onload = this._ProfilehandleReaderLoaded.bind(this);
    //reader.readAsBinaryString(this.selectedFile);
    reader.readAsDataURL(parentThis.ProfileselectedFile);
  }

  _ProfilehandleReaderLoaded(readerEvt) {
    this.HerdMasterWrapperModel.heardmasterModel.HerdProfilePic = readerEvt.target.result;
    this.HerdMasterWrapperModel.heardmasterModel.fileName = null;
  }

  public ProfileopenfileDialogue(event) {
    event.preventDefault();
    let element: HTMLElement = document.getElementById('upload') as HTMLElement;
    element.click();
  }

  //additional Photo

  public AdditionPhotoonSelectedFileName(event) {
    this.AdditionalPhotoselectedFile = <File>event.target.files[0];
    let extension = this.AdditionalPhotoselectedFile.name.split('.').pop();

    if (extension.toLowerCase() != 'png' && extension.toLowerCase() != 'jpg' && extension.toLowerCase() != 'jpeg') {
      // this.fileErrorMsg = MESSAGES.UPLOADFILEVALIDATION;
      alert("Please upload valid image.");
      this.validImage = false;
    }
    if (this.AdditionalPhotoselectedFile) {
      this.AdditionPhotoreadURL();
    }
  }

  //preview image after upload image
  AdditionPhotoreadURL() {

    var reader = new FileReader();
    let parentThis = this;

    var reader = new FileReader();
    reader.onload = this._AdditionPhotohandleReaderLoaded.bind(this);
    //reader.readAsBinaryString(this.selectedFile);
    reader.readAsDataURL(parentThis.AdditionalPhotoselectedFile);
  }

  _AdditionPhotohandleReaderLoaded(readerEvt) {

    let FileContent = readerEvt.target.result;
    let Filename = this.AdditionalPhotoselectedFile.name;


    this.HerdMasterWrapperModel.heardIdAddtionalPhotoModelList.heardIdAddtionalPhotoModels.push({ FileName: Filename, fileContent: FileContent.split(',')[1] });
  }

  public AdditionPhotoopenfileDialogue(event) {

    event.preventDefault();
    let element: HTMLElement = document.getElementById('AdditionalPhotoupload') as HTMLElement;
    element.click();
  }

  randomStringId(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  }

  // Edit Health Record
  EditHealthRecord(item) {
    item.IsEdit = true;
    item.recordDate = new Date(item.recordDate);
    this.heardHealthRecordModel = Object.assign({}, item);
  }

  //clear HealthRecord
  ClearHealtRecord() {
    this.heardHealthRecordModel = {};
  }


  // Edit health issue
  EditHealthIssue(item) {
    item.IsEdit = true;
    item.healthDate = new Date(item.healthDate);
    //this.heardHealthIssueModel = item;
    this.heardHealthIssueModel = Object.assign({}, item);
  }

  //clear HealthRecord
  ClearHealthIssue() {
    this.heardHealthIssueModel = {};
  }

  // Edit Show Record
  EditShowRecord(item) {
    item.IsEdit = true;
    item.showRecordDate = new Date(item.showRecordDate);
    this.heardHealthShowRecordModel = Object.assign({}, item);
  }

  //clear Show Record
  ClearShowRecord() {
    this.heardHealthShowRecordModel = {};
  }

  // Edit Breed Record
  EditBreedRecord(item) {
    item.IsEdit = true;
    item.breadDate = new Date(item.breadDate);
    this.herdBreedRecordModel = Object.assign({}, item);
  }

  //clear Breed Record
  ClearBreedRecord() {
    this.herdBreedRecordModel = {};
  }

  //Get Animal ID

  GetAnimalId() {
    this._httpClient.get(config.ServiceUrl + '/api/Gateway/GetAnimalIdDetails', this.httpOptions).subscribe(data => {
      this.HerdMasterWrapperModel.herdIdDetailsModel.idNumber = data;
    }, error => {
      this._loaderService.hide();
    });
  }

  //Get Animal Type
  getAnimalTypes() {
    //this._loaderService.show();
    this._httpClient.get(config.ServiceUrl + '/api/gateway/GetAnimaltypes', this.httpOptions).subscribe((data: any) => {
      this.animalTypes = data;
      //this.animalTypes.push({ id: null, name: 'Select One' });
      this._loaderService.hide();
    });
  }

  //Get Breed 
  getBreeds(animalTypeId) {
    //this.breeds = [{ id: null, name: 'Select One' }];
    if (this.HertManagementId > 0)
      this.HerdMasterWrapperModel.heardmasterModel.breed
    else
      this.HerdMasterWrapperModel.heardmasterModel.breed = null;

    if (animalTypeId > 0) {
      this._loaderService.show();
      this._httpClient.get(config.ServiceUrl + '/api/gateway/GetBreeds?animaltypeId=' + animalTypeId, this.httpOptions).subscribe((data: any) => {
        this.breeds = data;
        //this.breeds.push({ id: null, name: 'Select One' });
        this._loaderService.hide();
      }, error => {
        this._loaderService.hide();
      });
    }
  }

}
