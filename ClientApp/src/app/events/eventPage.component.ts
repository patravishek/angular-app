import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { EventDataService } from '../services/eventData.service';
import { LoaderService } from '../services/loader.service';
import { config } from '../../config/config';
import { EventModel } from '../../models/event.model';
import * as moment from 'moment';
import { _ } from 'underscore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ChangeDetectorRef } from '@angular/core';
declare var $: any;
const EVENTS: any[] = [{
  'evantName': 'Livestock City Launch Party',
  'evantDesc': 'Help us Celebrate LiveStock Citys Web and Mobile Apps',
  'eventTimeLoc': 'Charlottesville, VA',
  'eventType': 'All day',
  'eventDay': '15',
  'eventMonth': 'May',
  'eventYear': '2017'
},
{
  'evantName': 'Memorial Day BBQ',
  'evantDesc': 'Burgers, dogs, and beers for all!',
  'eventTimeLoc': 'Carthage, SD',
  'eventType': 'All day',
  'eventDay': '15',
  'eventMonth': 'May',
  'eventYear': '2017'
},
{
  'evantName': 'Farmers Market Trip',
  'evantDesc': 'Join us as we stroll the smog-filled streets and wish we were in the countryside',
  'eventTimeLoc': 'Los Angeles, CA',
  'eventType': '10:00AM - 2:00PM PT',
  'eventDay': '15',
  'eventMonth': 'May',
  'eventYear': '2017'
}];

@Component({
  selector: 'app-event-page',
  templateUrl: './eventPage.component.html',
  styleUrls: ['./eventPage.component.css']
})

export class EventPageComponent implements OnInit {
  EventEmailFormGroup: FormGroup;
  events: EventModel[] = [];
  searchText  = "";
  categoryFlag = 'ALL';
  emailIdList:any=[];
  isSubmitted = false;
  submitted = false;
  eventID = 0;
  emailPattern:any='^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
  rootImgPath: any = config.imgPath;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    })
  };

  constructor(private data: EventDataService, private http: HttpClient, private formBuilder: FormBuilder, private router: Router
    , public _loaderService: LoaderService) {
    this.events = this.data.getEvents();
    // .subscribe (
    //   data => this.eventsData = data;
    // )
  }
  ngOnInit() {
    this.getEvents();
    this.EventEmailFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]]
    });
  }

  getEvents() {
    this._loaderService.show();
    this.http.get<EventModel[]>(config.ServiceUrl + '/api/gateway/getuserEvents', this.httpOptions).subscribe((data) => {
      this.events = data != null ? data.map(a => new EventModel(a)) : [];
      _.each(this.events,function(event){
        if(event.EventDate != ""){
          var check = moment(event.EventDate, 'YYYY/MM/DD');
          event.month = check.format('MMM');
          event.day   = check.format('D');
          event.year  = check.format('YYYY');
        }
        if(event.EventEndTime != ""){
          event.eEnd  = moment(event.EventEndTime, ["HH:mm"]).format("hh:mm A");
        }
        if(event.EventStartTime != ""){
          event.eStart  = moment(event.EventStartTime, ["HH:mm"]).format("hh:mm A");
        }
      });
      setTimeout(() => {
        this._loaderService.hide();
      }, 2000);
    });
  }

  searchEvents() {
    // if (this.searchText) {
      this._loaderService.show();
      this.http.get<EventModel[]>(config.ServiceUrl + '/api/gateway/getuserEventsbysearch?searchtext=' + this.searchText + '&categoryFlag=' + this.categoryFlag, this.httpOptions).subscribe((data) => {
        this.events = data != null ? data.map(a => new EventModel(a)) : [];
        _.each(this.events,function(event){
          if(event.EventDate != ""){
            var check = moment(event.EventDate, 'YYYY/MM/DD');
            event.month = check.format('MMM');
            event.day   = check.format('D');
            event.year  = check.format('YYYY');
          }
          if(event.EventEndTime != ""){
            event.eEnd  = moment(event.EventEndTime, ["HH:mm"]).format("hh:mm A");
          }
          if(event.EventStartTime != ""){
            event.eStart  = moment(event.EventStartTime, ["HH:mm"]).format("hh:mm A");
          }
        });
        setTimeout(() => {
          this._loaderService.hide();
        }, 2000);
      });
    // }
  }
  categoryFilter(type){
    this.categoryFlag = type;
    this.searchEvents();
  }
  viewSingleEvent(event){
    if (event.EventId) {
      this.router.navigate(['/singleEvent/' + event.EventId])
    }    
  }
  shareEventByMail(eventID) {
    // if(this.emailIdList.length == 0){
    //   this.isSubmitted = true;
    //   return;
    // }

    if (this.EventEmailFormGroup.invalid) {
      this.submitted = true;
      return;
    }

    this.isSubmitted = false;
    this._loaderService.show();

    var emaillist=[];
    // _.each(this.emailIdList,function(obj){
    //   emaillist.push(obj.displayValue)
    // })
    var email = this.EventEmailFormGroup.value.email;
    emaillist.push(email)

    var model = {EventId:this.eventID,emaillist:emaillist};  
    this.http.post(config.ServiceUrl + '/api/gateway/shareEventByEmail', model, this.httpOptions).subscribe((data) => {
      $("#share-event-email").modal('hide');
      this.EventEmailFormGroup.value.email="";
      setTimeout(() => {
        this._loaderService.hide();
      }, 2000);
    });
  }
  
    OpenEmailsharePopup(eventID){
      this.eventID = eventID;
      $("#share-event-email").modal('show');
    }
  
    onTagsChanged(event){
      if (event && event.change == "add") {
        if (!event.tag.displayValue.match(this.emailPattern))
          this.emailIdList.pop()
      }
    }
}
