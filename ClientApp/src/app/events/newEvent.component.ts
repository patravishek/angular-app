import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { STATES, COUNTRIES } from '../../constants/constants';
import { EventModel } from '../../models/event.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../services/loader.service';
import { config } from '../../config/config';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';

// import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-newevent-page',
  templateUrl: './newEvent.component.html'
})


export class NewEventComponent implements OnInit {
  eventFormGroup: FormGroup;
  submitted = false;
  eventDetails: any = { EventName: '', State: '' };
  bsConfig: Partial<BsDatepickerConfig>;
  stateList = [];
  countryList = COUNTRIES;
  validImage = false;
  imageChangedEvent = null;
  selectedFile: File;
  public previewPhoto = null;
  event = new EventModel(null);
  searchText = null;
  isSubmitted = false;
  croppedImage = null;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    })
  };

  ngOnInit() {
    this.eventFormGroup = this.formBuilder.group({
      ename: ['', Validators.required],
      eventheadline: ['', Validators.required],
      eventdate: ['', Validators.required],
      estart: [''],
      eend: [''],
      eallDay: [''],
      eventstreet: ['', Validators.required],
      eventcity: ['', Validators.required],
      eventcountry: ['', Validators.required],
      eventstate: ['', Validators.required],
      eventzip: ['', Validators.required],
      eventdescription: ['', Validators.required]
    });
  }

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router
    , public _loaderService: LoaderService, private toaster: ToastrService) {
    this.bsConfig = { showWeekNumbers: false };
  }


  onChangeCountry() {
    this.stateList = [];
    this.eventDetails.EventState = null;
    var eventCountry = this.eventDetails.EventCountry;
    if (eventCountry) {
      var country = this.countryList.find(function (item) { return item.Name == eventCountry });

      if (country) {
        this.stateList = STATES.filter(item => {
          return item.CountryId == country.Id;
        })
      }
    }
  }

  public onSelectedFileName(event) {
    this.imageChangedEvent = event;
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

  public openFileDialogue(event) {
    event.preventDefault();
    let element: HTMLElement = document.getElementById('profile-photo-update') as HTMLElement;
    element.click();
  }

  //preview image after upload image
  readURL(type) {
    var reader = new FileReader();
    let parentThis = this;

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(parentThis.selectedFile);
  }

  _handleReaderLoaded(readerEvt) {
    this.previewPhoto = readerEvt.target.result;
    this.eventDetails.PhotoUrl = (this.previewPhoto.split(',')[1]);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  saveEvent() {
    if (this.eventFormGroup.invalid || !this.validImage) {
      this.isSubmitted = true;
      return;
    }
    if (!this.event.AllDayEvent && !this.event.EventStartTime && !this.event.EventEndTime) {
      // Please select all day or time of event.
      this.toaster.error("Please select all day or time of event.");
      this.isSubmitted = true;
      return;
    }
    if (this.event.AllDayEvent && (this.event.EventStartTime || this.event.EventEndTime)) {
      // Message : This is all day event so no need of start time or end time.
      this.toaster.error("This is all day event so no need of start time or end time.");
      this.isSubmitted = true;
      return;
    }
    if (!this.event.AllDayEvent) {
      if (!this.event.EventStartTime) {
        // Message : Start time is required.
        this.toaster.error("Start time is required.");
        this.isSubmitted = true;
        return;
      }
      if (!this.event.EventEndTime) {
        // Message : End time is required.
        this.toaster.error("End time is required.");
        this.isSubmitted = true;
        return;
      }
      // if(this.event.EventStartTime < this.event.EventEndTime)
      // {
      //   // Message : Please select dnd time is more then start time.
      //   this.toaster.error("Please select dnd time is more then start time.");
      //   this.isSubmitted = true;
      //   return;
      // }
    }
    this.isSubmitted = false;

    if (this.croppedImage)
      this.event.EventPicture = (this.croppedImage.split(',')[1]);

    this._loaderService.show();
    this.event.EventOwnerId = localStorage.getItem("id");
    this.http.post(config.ServiceUrl + '/api/gateway/SaveUpdateEvent',
      this.event, this.httpOptions).subscribe(data => {
        this.croppedImage = null;
        this.event.EventPicture = null;
        this._loaderService.hide();
        this.router.navigate(['/eventPage'])
      },
        error => {
          this._loaderService.hide();
        });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  blockSpecialChar(e) {
    var k;
    document.all ? k = e.keyCode : k = e.which;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  };
  GetEventDetails() {
    //Todo get event by id
  }


}
