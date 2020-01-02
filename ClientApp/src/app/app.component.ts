import { Component, OnInit,EventEmitter } from '@angular/core';
import { LoaderService } from './services/loader.service';
import { Router, RouterEvent, NavigationStart, NavigationCancel, NavigationError, NavigationEnd } from '@angular/router';
//import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { HubConnection, HubConnectionBuilder , LogLevel,HttpTransportType} from '@aspnet/signalr';
import { config } from '../config/config';
import {SignalRService} from './signalR/signalRService';

@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
title = 'app';
public  _hubConnection: HubConnection;
public message: string;
public async: any;
connectionEstablished = new EventEmitter<Boolean>();
Loginuserid: any;
Token: any;

constructor(public _loaderService: LoaderService,
private router: Router) {

router.events.subscribe((event: RouterEvent) => {
this.navigationInterceptor(event);
if (event instanceof NavigationEnd) {
    this.router.navigated = false;
    window.scrollTo(0, 0);
}
})

this.router.routeReuseStrategy.shouldReuseRoute = function(){
    return false;
};






}

// Shows and hides the loading spinner during RouterEvent changes
navigationInterceptor(event: RouterEvent): void {
if (event instanceof NavigationStart) {
this._loaderService.show();
}
if (event instanceof NavigationEnd) {
setTimeout(() => {
this._loaderService.hide();
}, 3000);
}

// Set loading state to false in both of the below events to hide the spinner in case a request fails
if (event instanceof NavigationCancel) {
setTimeout(() => {
this._loaderService.hide();
}, 3000);
}
if (event instanceof NavigationError) {
setTimeout(() => {
this._loaderService.hide();
}, 3000);
}
}

  ngOnInit() {
    var connection = new signalR.HubConnectionBuilder().withUrl("../MyChatHub").build();
    connection.start().catch(function (err) {
      return console.error(err.toString());
    });

    // this.Token = window.localStorage.getItem('token');
    // this.Loginuserid = window.localStorage.getItem('id');
    //  if (this.Token && this.Loginuserid) {
    //  this.createConnection();
    //  this.startConnection();
    //  }        
}

private createConnection() {
    this._hubConnection = new  HubConnectionBuilder()
        .withUrl("https://localhost:44391/MyChatHub?UserID="+this.Loginuserid+"&token="+this.Token,{ 
          skipNegotiation: true, 
      transport: HttpTransportType.WebSockets})
      .configureLogging(LogLevel.Debug)
            .build();

  //var connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:44391/chat").build();

    // connection.invoke("SendMessage", "Rakesh", "Test").catch(function (err) {
    //     return console.error(err.toString());
    // });

    // connection.start().then(()=>{
    //     console.log('Hub connection started');

    // }).catch(err => {
    //     console.log('Error while establishing connection, retrying...');
    //     //setTimeout(() => this.startConnection(), 5000);
    // });


    //setTimeout(() => {
      this._hubConnection.start().then(() => {
        console.log('Hub connection started');
        this.connectionEstablished.next(true);
      }).catch(err => {
            console.log('Error while establishing connection, retrying...');
            //setTimeout(() => this.startConnection(), 5000);
        });
    //}, 2000);
}
private startConnection(): void {
    this._hubConnection
        .start()
        .then(data => {
            ///this.connectionIsEstablished = true;
            console.log('Hub connection started');
            if (this.Token && this.Loginuserid) {
                this._hubConnection.invoke('RefreshOnlineUsers',this.Loginuserid ,this.Token).then(data=>{
                    this._hubConnection.on('RefreshOnlineUsers', (data) => {
                        console.log(data);
                    })
                })

            }
            //let userDetail = JSON.parse(localStorage.getItem('userDetail'));
            // let userID = window.localStorage.getItem('id');//((userDetail instanceof Object) && userDetail.id) ? userDetail.id : "";
            // if (userID) {
            //     this._hubConnection.invoke('CreateGroup', userID);
            // }
        })
        .catch(err => {
            console.log('Error while establishing connection, retrying...');
            setTimeout(() => this.startConnection(), 5000);
        });
}

}
