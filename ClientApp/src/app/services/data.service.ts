import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject(false);
  private messageSource2 = new BehaviorSubject("");
  private NotificationSource = new BehaviorSubject("");
  private NotificationCountSource = new BehaviorSubject("");

  currentMessage = this.messageSource.asObservable();
  userName = this.messageSource2.asObservable();
  NotificationList=this.NotificationSource.asObservable();
  Notificationcount=this.NotificationCountSource.asObservable();

  constructor() { }

  changeMessage(IsLoggedIn: boolean) {
    this.messageSource.next(IsLoggedIn);
  }

  displayUserName(FirstName: string) {
    this.messageSource2.next(FirstName);
  }

  getNotificationList(data:any){
    this.NotificationSource.next(data);
  }

  getNotificationCount(data:any){
    this.NotificationCountSource.next(data);
  }

}
