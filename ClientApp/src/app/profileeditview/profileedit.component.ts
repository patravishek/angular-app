import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserDetails, UserLookingFor } from '../../models/user.model';
import { FarmProfile } from '../../models/farmprofile.model';
import { PrivacySetting, PrivacyOptions } from '../../models/privacySetting.model';
import { ChangePassword } from '../../models/changepassword.model';
import { NgForm } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { ChangePasswordValidator } from './password-validation';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { config } from '../../config/config';
import { LoaderService } from '../services/loader.service';
import { COUNTRIES, STATES } from '../../constants/constants';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DEFAULTIMAGES } from '../../constants/constants';
import { _ } from 'underscore';

@Component({
  selector: 'app-profileedit',
  templateUrl: './profileedit.component.html'

})
export class ProfileEditComponent implements OnInit {

  userProfileFormGroup: FormGroup;
  farmProfiledFormGroup: FormGroup;
  privacyFormGroup: FormGroup;
  changePasswordFormGroup: FormGroup;

  Usersubmitted = false;
  rootImgPath: any = config.imgPath;
  farmSubmited = false;
  privacysubmitted = false;
  changePasswordSubmited = false;
  isSubmitted = false
  countryList = COUNTRIES;
  stateList = [];
  public selectedFile: File;
  public selectedFarmFile: File;
  public previewFarmPhoto = null;
  validImage = true;
  passwordPattern = new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
  imageChangedEvent: any = '';
  croppedImage: any = '';
  FarmDetailsSubmitted = false;
  defaultUserImg = DEFAULTIMAGES.UserImage;
  defaultFarmImg = DEFAULTIMAGES.FarmImage;

  LookingForList: any = [
    { Id: 1, LookupType: "Business partners", IsSelected: false },
    { Id: 2, LookupType: "New business", IsSelected: false },
    { Id: 3, LookupType: "Animals for sale", IsSelected: false },
    { Id: 4, LookupType: "Farm work", IsSelected: false },
    { Id: 5, LookupType: "Hired help", IsSelected: false },
    { Id: 6, LookupType: "Friends with common interests", IsSelected: false },
  ]

  AnimalList: any = [
    { Id: 1, InterestName: "Pigs", IsSelected: false },
    { Id: 2, InterestName: "Horses", IsSelected: false },
    { Id: 3, InterestName: "Cattle", IsSelected: false },
    { Id: 4, InterestName: "Llama", IsSelected: false },
    { Id: 5, InterestName: "Avian", IsSelected: false },
    { Id: 6, InterestName: "Sheep", IsSelected: false },
  ];

  bsConfig: Partial<BsDatepickerConfig>;

  public _httpClient: HttpClient;
  public userDetails: UserDetails;
  public farmProfile: FarmProfile;
  public privacyOptions: PrivacyOptions;
  public changePasswordModel: ChangePassword;
  public privacySetting: PrivacySetting;
  public birthdayPrivacy: any = {};
  public emailPrivacy: any = {};
  public countryPrivacy: any = {};
  public statePrivacy: any = {};
  public cityPrivacy: any = {};
  public streetPrivacy: any = {};
  UserDetailsSubmitted = false;

  private _isUserProfileFetched: Boolean;
  private _isfarmProfileFetched: Boolean;
  private _isprivacySettingFetched: Boolean;
  private changePasswordSuccess: Boolean = false;
  private changePasswordFailed: Boolean = false;
  private changePasswordError: string;
  //Camera
  private width: number;
  private height: number;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  // latest snapshot
  public webcamImage: WebcamImage = null;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  public IsShowError: any = false;
  public ErrorMsg: any;

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public imageBase64Url: any;
  public IsCamera: any = false;
  public previewPhoto = null;
  public emailPattern = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
  public namePattern = '[A-Za-z0-9^]*';
  //End camera


  private IsSubscribed: boolean;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    })
  };

  loggedInUserId = localStorage.getItem('id');
  constructor(httpClient: HttpClient, private formBuilder: FormBuilder,
    private _loaderService: LoaderService, private data: DataService,
    private _sanitizer: DomSanitizer) {
    this._loaderService.show();
    this._httpClient = httpClient;
    this.userDetails = new UserDetails(null);
    this.farmProfile = new FarmProfile(null);
    this.privacyOptions = new PrivacyOptions(null);
    this.changePasswordModel = new ChangePassword();
    this.privacySetting = new PrivacySetting();
    this.bsConfig = { showWeekNumbers: false };
    setTimeout(() => {
      this._loaderService.hide();
    }, 2000);

  }

  ngOnInit() {
    // this.userProfileFormGroup = this.formBuilder.group({
    //   firstName: ['', [Validators.required, Validators.pattern('[A-Za-z0-9^]*')]],
    //   lastName: ['', [Validators.required, Validators.pattern('[A-Za-z0-9^]*')]],
    //   username: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
    //   phone: '',
    //   birthday: '',
    //   education: '',
    //   hobbies: '',
    //   description: '',
    // });

    // this.userDetails = new UserDetails(null);
    this.farmProfile = new FarmProfile(null);
    this.privacyOptions = new PrivacyOptions(null);
    this.privacySetting = new PrivacySetting();
    this._isUserProfileFetched = false;
    this._isfarmProfileFetched = false;
    this._isprivacySettingFetched = false;
    this.GetUserDetails();

    this.changePasswordFormGroup = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newpassword: ['', [Validators.required]],
      repeatPassword: ['', Validators.required]
    });
    // , {
    //     validator: ChangePasswordValidator.validate.bind(this)
    //   });

    this.farmProfiledFormGroup = this.formBuilder.group({
      operatingSince: ['', Validators.required],
      farmdescription: '',
      farmName: ['', [Validators.required, Validators.pattern('[A-Za-z0-9^]*')]],
      street: '',
      city: '',
      state: ['', Validators.required],
      //zip: '',
      country: ['', Validators.required]
    });

    this.privacyFormGroup = this.formBuilder.group({
      seeYourPost: ['', Validators.required],
      onlineStatus: ['', Validators.required],
      seeYourProfile: ['', Validators.required]
    });
  }



  //get f() { return this.userProfileFormGroup.controls; }
  GetUserDetails() {
    // if (!this._isUserProfileFetched) {
    this._loaderService.show();
    this._httpClient.get<UserDetails>(config.ServiceUrl + '/api/gateway/userprofile', this.httpOptions).subscribe((data: any) => {
      this.userDetails = new UserDetails(data);
      this.UserDetailsSubmitted = false;
      this.imageChangedEvent = '';
      if (this.userDetails.UserLookingFor.length == 0)
        this.userDetails.UserLookingFor = this.LookingForList;
      this.stateList = STATES;  //Todo dev states acccording to country
      this._isUserProfileFetched = true;

      var profilePic = data.profilePicture;
      this.userDetails.UserImageUrl = (profilePic.fileName) ? (this.rootImgPath + profilePic.fileName) : this.defaultUserImg;
      if (this.userDetails.Birthday)
        this.userDetails.Birthday = new Date(this.userDetails.Birthday);

      // this.farmProfile.Zip = this.userDetails.Zip;
      // this.farmProfile.State = this.userDetails.State;
      // this.farmProfile.City = this.userDetails.State;
      // this.farmProfile.Street = this.userDetails.Street;
      // this.farmProfile.Country = this.userDetails.Country;
      this._httpClient.get(config.ServiceUrl + '/api/gateway/GetUserPrivacybyuserid?userid=' + this.loggedInUserId, this.httpOptions).subscribe((data: any) => {
        this.birthdayPrivacy = data.find(function (item) { return item.fieldname == "Birthday" });
        this.emailPrivacy = data.find(function (item) { return item.fieldname == "Email" });
        this.countryPrivacy = data.find(function (item) { return item.fieldname == "Country" });
        this.statePrivacy = data.find(function (item) { return item.fieldname == "State" });
        this.cityPrivacy = data.find(function (item) { return item.fieldname == "City" });
        this.streetPrivacy = data.find(function (item) { return item.fieldname == "Street" });

        if (!this.birthdayPrivacy)
          this.birthdayPrivacy = {};
        if (!this.emailPrivacy)
          this.emailPrivacy = {};
        if (!this.countryPrivacy)
          this.countryPrivacy = {};
        if (!this.statePrivacy)
          this.statePrivacy = {};
        if (!this.cityPrivacy)
          this.cityPrivacy = {};
        if (!this.streetPrivacy)
          this.streetPrivacy = {};

        this._loaderService.hide();
        this.croppedImage = null;

      });
    },
      error => {
      }
    );
    // }
  }

  onChangeCountry() {
    this.stateList = [];

    var farmProfileCountry = this.farmProfile.Country;
    if (farmProfileCountry) {
      var country = this.countryList.find(function (item) { return item.Name == farmProfileCountry });

      if (country) {
        this.stateList = STATES.filter(item => {
          return item.CountryId == country.Id;
        })
      }
    }
  }

  GetPrivacyOptions() {
    // if (!this._isprivacySettingFetched) {
    this._loaderService.show();
    this._httpClient.get<PrivacyOptions>(config.ServiceUrl + '/api/gateway/pricacySettings', this.httpOptions).subscribe(data => {
      if (data) {
        this.privacyOptions = new PrivacyOptions(data);
        this._isprivacySettingFetched = true;
      }
      this._loaderService.hide();
    });
    //}
  }

  GetFarmProfile() {
    //if (!this._isfarmProfileFetched) {
    this._loaderService.show();
    this._httpClient.get<FarmProfile>(config.ServiceUrl + '/api/gateway/farmProfile', this.httpOptions).subscribe(data => {
      this.farmProfile = new FarmProfile(data);
      this.farmProfile.Country =  this.farmProfile.Country || this.userDetails.Country;
      this.farmProfile.State =  this.farmProfile.State || this.userDetails.State;
      this.farmProfile.City =  this.farmProfile.City || this.userDetails.City;
    //  this.farmProfile.Zip =  this.farmProfile.Zip || this.userDetails.Zip;

      var AnimalLst=this.AnimalList;
      _.each(this.farmProfile.Animals,function(obj){
        var isExist=_.find(AnimalLst,function(res){
             if(res.InterestName==obj)
                return res.IsSelected=true;
        })
      });
      this.AnimalList=AnimalLst;
      this._isfarmProfileFetched = true;
      this.FarmDetailsSubmitted = false;
      this.imageChangedEvent = '';
      this.farmProfile.FarmDisplayLogoPath = (this.farmProfile.FarmLogoPath) ? (this.rootImgPath + this.farmProfile.FarmLogoPath) : this.defaultFarmImg;
      this._loaderService.hide();

      this.croppedImage = null;
    });
    //}
  }

  //Save user profile
  SaveUserProfile(form) {
    if (form.invalid || !this.validImage) {
      this.isSubmitted = true;
      return;
    }
    this.isSubmitted = false;
    // if (this.imageBase64Url){
    //   this.imageBase64Url = this.imageBase64Url.replace("data:image/jpeg;base64,", "")
    //   this.userDetails.Profileurl = this.imageBase64Url;
    // }

    if (this.croppedImage)
      this.userDetails.Profileurl = (this.croppedImage.split(',')[1]);

    this.userDetails.IsSubscribed = this.IsSubscribed;
    this._loaderService.show();
    this.userDetails.Id = localStorage.getItem("id");
    this._httpClient.post(config.ServiceUrl + '/api/gateway/userprofile/save',
      this.userDetails, this.httpOptions).subscribe(data => {
        this.UserDetailsSubmitted = true;
        this.croppedImage = null;
        this.userDetails.UserImageUrl = null;
        this.IsCamera = false;
        this.imageBase64Url = null;
        this.GetUserDetails();
        this._loaderService.hide();
      },
        error => {
          this._loaderService.hide();
        });
  }

  SaveFarmProfile(form) {
    if (form.invalid || !this.validImage) {
      this.isSubmitted = true;
      return;
    }
    this.isSubmitted = false;

    // this.farmProfile.Zip = this.userDetails.Zip;
    // this.farmProfile.State = this.userDetails.State;
    // this.farmProfile.City = this.userDetails.State;
    // this.farmProfile.Street = this.userDetails.Street;
    // this.farmProfile.Country = this.userDetails.Country;

    if (this.croppedImage)
      this.farmProfile.FarmLogo = (this.croppedImage.split(',')[1]);

      var SelectAnimalList = this.AnimalList.filter(ele => {
        return ele.IsSelected;
      })

      var result = SelectAnimalList.map(function (obj) { return obj.InterestName; });
      

    this._loaderService.show();
    this.farmProfile.FarmLogoPath = null;
    this.farmProfile.Animals=result;
    this._httpClient.post(config.ServiceUrl + '/api/gateway/farmProfile/save',
      (this.farmProfile), this.httpOptions).subscribe(data => {
        this._loaderService.hide();
        this.FarmDetailsSubmitted = true;
        this.croppedImage = null;
        this.farmProfile.FarmLogoPath = null;
        this.GetFarmProfile();
      },
        error => {
          this._loaderService.hide();

        });
  }

  OnPostPrivacyChange(postPrivacy: any) {
    this.ResetPrivacySetting(this.privacyOptions.PostPrivacy);
    postPrivacy.IsSelected = true;
  }

  OnOnlineStatusPrivacyChange(onlineStatusPrivacy: any) {
    this.ResetPrivacySetting(this.privacyOptions.OnlineStatus);
    onlineStatusPrivacy.IsSelected = true;
  }
  OnProfileDetailsPrivacyChange(profileDetailsPrivacy: any) {
    this.ResetPrivacySetting(this.privacyOptions.ProfileDetails);
    profileDetailsPrivacy.IsSelected = true;
  }

  ResetPrivacySetting(privacy: any[]) {
    privacy.forEach(function (item) { item.IsSelected = false; });
  }

  SavePrivacySetting() {
    this._loaderService.show();
    this._httpClient.post(config.ServiceUrl + '/api/gateway/pricacySettings/save',
      JSON.stringify(this.privacyOptions), this.httpOptions).subscribe(data => {
        this._loaderService.hide();
      },
        error => {
          this._loaderService.hide();
        });

  }

  ChangePassword(form) {
    if (form.invalid || (this.changePasswordModel.NewPassword != this.changePasswordModel.ConfirmPassword)) {
      this.isSubmitted = true;
      return;
    }

    this.isSubmitted = false;

    this._loaderService.show();
    this._httpClient.post(config.ServiceUrl + '/api/gateway/changepassword',
      JSON.stringify(this.changePasswordModel), this.httpOptions).subscribe(data => {
        this.changePasswordSuccess = true;
        this.changePasswordModel = new ChangePassword();
        form.reset();
        this._loaderService.hide();
      },
        error => {
          this.changePasswordError = error.error;
          this.changePasswordFailed = true;
          this._loaderService.hide();
        });
  }

  SelectedLookingForList(i) {
    if (i > -1) {
      this.userDetails.UserLookingFor[i].IsSelected = !this.userDetails.UserLookingFor[i].IsSelected;
    }
  }


  //Camera start
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
    this.takeAnother();
  }

  public handleInitError(error: WebcamInitError): void {
    this.IsShowError = true;
    this.ErrorMsg = "Camera error";
    //this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.imageBase64Url = this.webcamImage.imageAsDataUrl;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public takeAnother() {
    this.webcamImage = null;
    this.imageBase64Url = null;
  }

  OpenCamera() {
    this.IsCamera = true;
    this.previewPhoto = null;
  }
  //End Camera

  public onSelectedFileName(event) {
    this.imageChangedEvent = event;
    this.IsCamera = false;
    this.selectedFile = <File>event.target.files[0];
    this.validImage = true;

    if (this.selectedFile) {
      let extension = this.selectedFile.name.split('.').pop();

      if (extension.toLowerCase() != 'png' && extension.toLowerCase() != 'jpg' && extension.toLowerCase() != 'jpeg') {
        // this.fileErrorMsg = MESSAGES.UPLOADFILEVALIDATION;
        alert("Please upload valid image.");
        this.validImage = false;
        return;
      }
      this.readURL("UserProfile");
    }
  }

  //preview image after upload image
  readURL(type) {
    var reader = new FileReader();
    let parentThis = this;

    if (type == "UserProfile") {
      //reader.readAsBinaryString(this.selectedFile);
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(parentThis.selectedFile);
    }
    else {
      reader.onload = this._handleFarmFileReaderLoaded.bind(this);
      reader.readAsDataURL(parentThis.selectedFarmFile);
    }
  }

  _handleReaderLoaded(readerEvt) {
    this.previewPhoto = readerEvt.target.result;
    this.userDetails.Profileurl = (this.previewPhoto.split(',')[1]);
  }

  _handleFarmFileReaderLoaded(readerEvt) {
    this.previewFarmPhoto = readerEvt.target.result;
    //   this.farmProfile.FarmLogo = (this.previewFarmPhoto.split(',')[1]);
  }

  public openfileDialogue(event) {
    this.IsCamera = false;
    event.preventDefault();
    let element: HTMLElement = document.getElementById('upload-profile-photo') as HTMLElement;
    element.click();

  }

  //Farm profile image

  public onSelectedFarmFileName(event) {
    this.imageChangedEvent = event;
    this.IsCamera = false;
    this.selectedFarmFile = <File>event.target.files[0];
    this.validImage = true;

    if (this.selectedFarmFile) {
      let extension = this.selectedFarmFile.name.split('.').pop();

      if (extension.toLowerCase() != 'png' && extension.toLowerCase() != 'jpg' && extension.toLowerCase() != 'jpeg') {
        alert("Please upload valid image.");
        this.validImage = false;
        return;
      }
      this.readURL("FarmProfile");
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  openFarmFileDialogue(event) {
    event.preventDefault();
    let element: HTMLElement = document.getElementById('upload-farm-photo') as HTMLElement;
    element.click();
  }

  setPrivacy(id, field, privacyType) {
    this._loaderService.show();

    var privacyDet = { UserId: this.loggedInUserId, fieldname: field, privcytype: privacyType, Id: id };
    this._httpClient.post(config.ServiceUrl + '/api/gateway/SaveUserPrivacy/save',
      privacyDet, this.httpOptions).subscribe(data => {
        this._loaderService.hide();
        this.GetUserDetails();
        this.GetFarmProfile();
      },
        error => {
          this._loaderService.hide();
        });
  }

  //window resize
  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    const win = !!event ? (event.target as Window) : window;
    this.width = win.innerWidth;
    this.height = win.innerHeight;
  }

  SelectedAnimalList(i) {
    if (i > -1) {
      this.AnimalList[i].IsSelected = !this.AnimalList[i].IsSelected;
    }
  }
}
