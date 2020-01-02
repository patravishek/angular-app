import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { LoaderService } from '../services/loader.service';
import { config } from '../../config/config';
import { EventModel } from '../../models/event.model';
import * as moment from 'moment';
import { _ } from 'underscore';
import { ShareButtons } from '@ngx-share/core';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-event-page',
  templateUrl: './singleEvent.component.html',
  styleUrls: ['./singleEvent.component.css']
})

export class SingleEventComponent implements OnInit {
  EventEmailFormGroup: FormGroup;
  eventID: any;
  eventDetails: any = {};
  rootImgPath: any = config.imgPath;
  emailIdList: any = [];
  isSubmitted = false;
 submitted = false;
  emailPattern: any = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
  EventImage: any;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    })
  };
  loggedInUserId = localStorage.getItem('id');
  constructor(private http: HttpClient, private router: ActivatedRoute
    , public _loaderService: LoaderService, public share: ShareButtons, private toaster: ToastrService
    ,private formBuilder: FormBuilder) {
    this.router.params.subscribe(params => {
      this.eventID = params['id'];
    })
  }
  ngOnInit() {
    this.getEventDet();
    this.EventEmailFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]]
    });
  }

  getEventDet() {
    this._loaderService.show();
    this.http.get<EventModel[]>(config.ServiceUrl + '/api/gateway/getuserEventsByEventId?eventId=' + this.eventID, this.httpOptions).subscribe((data) => {
      this.eventDetails = data != null ? new EventModel(data) : {};
      if (this.eventDetails.EventDate != "") {
        var check = moment(this.eventDetails.EventDate, 'YYYY/MM/DD');
        this.eventDetails.Month = check.format('MMM');
        this.eventDetails.Day = check.format('D');
        this.eventDetails.Year = check.format('YYYY');
      }
      if (this.eventDetails.EventEndTime != "") {
        this.eventDetails.eEnd = moment(this.eventDetails.EventEndTime, ["HH:mm"]).format("hh:mm A");
      }
      if (this.eventDetails.EventStartTime != "") {
        this.eventDetails.eStart = moment(this.eventDetails.EventStartTime, ["HH:mm"]).format("hh:mm A");
      }
      this.EventImage = (this.rootImgPath + this.eventDetails.FileName);

      setTimeout(() => {
        this._loaderService.hide();
      }, 2000);
    });
  }
  eventInterested() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
      })
    };
    this._loaderService.show();
    var eventModel = { EventId: this.eventID, userId: this.loggedInUserId};
    this.http.post(config.ServiceUrl + '/api/gateway/saveUpdateEventIntrest', eventModel, httpOptions).subscribe((data: any) => {
      this.toaster.success("You are interested in this event.");
      this._loaderService.hide();
      this.getEventDet();
    },
      error => {
        this._loaderService.hide();
      });
  }

  //Share event by mail
  shareEventByMail() {
    var emaillist = [];

    // if (this.emailIdList.length == 0){
    //   this.isSubmitted = true;
    //   return;
    // }

    if (this.EventEmailFormGroup.invalid) {
      this.submitted = true;
      return;
    }

    this.isSubmitted = false;
    this._loaderService.show();

    // _.each(this.emailIdList, function (obj) {
    //   emaillist.push(obj.displayValue)
    // })

    var email = this.EventEmailFormGroup.value.email;
    emaillist.push(email)
    var model = { EventId: this.eventID, emaillist: emaillist };

    this.http.post(config.ServiceUrl + '/api/gateway/shareEventByEmail', model, this.httpOptions).subscribe((data) => {
      $("#share-event-email").modal('hide');
      this.EventEmailFormGroup.value.email="";
      setTimeout(() => {
        this._loaderService.hide();
      }, 2000);
    });
  }

  OpenEmailsharePopup() {
    $("#share-event-email").modal('show');
  }

  onTagsChanged(event) {
    if (event && event.change == "add") {
      if (!event.tag.displayValue.match(this.emailPattern))
        this.emailIdList.pop()
    }
  }
}
