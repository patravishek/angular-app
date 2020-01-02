import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SignalRService } from '../signalR/signalRService';
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
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
    MessageDetails: FormGroup;
    connectionEstablished = new EventEmitter<Boolean>();
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

    //Search autocomplete
    UserList: any = [];
    @ViewChild('instance') instance: NgbTypeahead;
    focusSearchUser$ = new Subject<string>();
    clickSearchUser$ = new Subject<string>();
    message: any;
    openMessageDetails: any;
    selectedUserDetails: any;
    //End search autocomplete

    constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router
        , public _loaderService: LoaderService, private toaster: ToastrService) {
        //this.events = this.data.getEvents();
    }

    ngOnInit() {
        this.Token = window.localStorage.getItem('token');
        this.Loginuserid = window.localStorage.getItem('id');
        this.openMessageDetails = false;
        this.selectedUserDetails = {};
        this.getUserList();
        this.MessageDetails = this.formBuilder.group({
            selectedUser: [''],
            Message: ['']
        });
        if (this.Token && this.Loginuserid) {
            this.createConnection();
            this.registerOnServerEvents();
            this.startConnection();
        }
    }

    private createConnection() {
        this._hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(config.ServiceUrl + "/chatHub")
            .build();
        // this._hubConnection = new HubConnectionBuilder()
        //     .withUrl("https://localhost:44391/MyChatHub?UserID=" + this.Loginuserid + "&token=" + this.Token)
        //     .build();
    }

    private startConnection(): void {
        this._hubConnection.start().catch(er => {
            console.log(er.toString());
            setTimeout(() => this.startConnection(), 5000);
        }
        );
        // this._hubConnection
        //     .start()
        //     .then(() => {
        //         this.connectionIsEstablished = true;
        //         console.log('Hub connection started');
        //         this.connectionEstablished.emit(true);
        //         let userDetail = JSON.parse(localStorage.getItem('userDetail'));
        //         let userID = ((userDetail instanceof Object) && userDetail.id) ? userDetail.id : "";
        //         if (userID) {
        //             this._hubConnection.invoke('CreateGroup', userID);
        //         }
        //     })
        //     .catch(err => {
        //         console.log('Error while establishing connection, retrying...');
        //         setTimeout(this.startConnection(), 5000);
        //     });
        //         .onclose(evt => {

        //         });
        //  {//since there is an error, sockets will close so...
        //    sok.onclose=function(e){
        //        console.log("WebSocket Error: " , e);};
    }

    private registerOnServerEvents(): void {
        this._hubConnection.on("ForwardToClients", (user, message) => {
            this.getUserMessageList(this.selectedUserDetails.userId);
        });
        // this._hubConnection.on('Send', (message: any) => {
        //     debugger;
        //     // if (requestType == 'W') {
        //     //     let userDetail = JSON.parse(localStorage.getItem('userDetail'));
        //     //     if (userDetail instanceof Object) {
        //     //         if (userDetail.id == userId && userDetail.loginSessionID && (userDetail.loginSessionID != loginSessionID)) {
        //     //             localStorage.removeItem('currentUser');
        //     //             localStorage.removeItem('userDetail');
        //     //             this._router.navigate([this._dataConstant.routeUrl.Logout]);
        //     //             this.isMultipleLogin = true;
        //     //         }
        //     //     }
        //     // }
        // });
        // this._hubConnection.on('TimeClockAction', (checkinCheckoutDetail: any) => {
        //     debugger;
        //     // if (this._router.url == this._dataConstant.routeUrl.Index)
        //     //     this._dataService.ChangeCurrentCheckDetail(checkinCheckoutDetail);
        // });
    }
    createGroup(): void {
        if (this.connectionIsEstablished) {
            let userDetail = JSON.parse(localStorage.getItem('userDetail'));
            let userID = ((userDetail instanceof Object) && userDetail.id) ? userDetail.id : "";
            if (userID) {
                this._hubConnection.invoke('CreateGroup', userID);
                this._hubConnection.invoke('Send', 'W');
            }
        }
    }

    // private createConnection() {
    //     this._hubConnection = new HubConnectionBuilder()
    //         .withUrl("https://localhost:44391/MyChatHub?UserID=" + this.Loginuserid + "&token=" + this.Token, {
    //             skipNegotiation: true,
    //             transport: HttpTransportType.WebSockets
    //         })
    //         .configureLogging(LogLevel.Debug)
    //         .build();

    //         this._hubConnection.on('send', data => {  
    //             debugger;
    //             console.log(data);  
    //         });
    // }



    // private startConnection(): void {
    //     this._hubConnection
    //         .start()
    //         .then(data => {
    //             ///this.connectionIsEstablished = true;
    //             console.log('Hub connection started');



    //             if (this.Token && this.Loginuserid) {
    //                 this._hubConnection.invoke('RefreshOnlineUsers', this.Loginuserid, this.Token).then(data => {
    //                     debugger
    //                     console.log(data);
    //                     this._hubConnection.on('RefreshOnlineUsers', (userID, token, data) => {
    //                         debugger
    //                         console.log(data);
    //                     })



    //                     // this._hubConnection.on('RefreshOnlineUsers', (userID,token,data) => {
    //                     //             debugger
    //                     //             console.log(data);
    //                     //         })
    //                 })



    //             }

    //         })
    //         .catch(err => {
    //             console.log('Error while establishing connection, retrying...');
    //             setTimeout(() => this.startConnection(), 5000);
    //         });
    // }

    getUserList() {
        this._loaderService.show();
        this.http.get<object[]>(config.ServiceUrl + '/api/gateway/GetFollowingUserList', this.httpOptions).subscribe((data) => {
            //this.userList = data != null ? data.map(a => new Objectct(a)) : [];
            this.userList = data
            _.each(this.userList, function (user) {
                if (user.lastUpdationTime != "") {
                    user.lastUpdationTimeString = moment(user.lastUpdationTime, 'YYYY/MM/DD');
                }
                user.fullName = user.userFirstName + " " + user.userLastName;
            });
            setTimeout(() => {
                this._loaderService.hide();
            }, 2000);
        });
    }

    //Search user autocomplete start
    searchUser = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
        //const clicksWithClosedPopup$ = this.clickSearchUser$.pipe(filter(() => !this.instance.isPopupOpen()));
        const inputFocus$ = this.focusSearchUser$; //clicksWithClosedPopup$
        return merge(debouncedText$, inputFocus$).pipe(
            map(term => (term === '' ? this.userList
                : this.userList.filter(v => v.fullName.toLowerCase().indexOf(term != null ? term.toLowerCase() : "") > -1)).slice(0, 10))
        );
    }
    formatterUser = (x: { fullName: string }) => x.fullName;

    selectedUser(item) {
        this.message.SelectedUser = item.item;
    }
    selectUser(user) {
        this.openMessageDetails = true;
        this.selectedUserDetails = user;
        this.getUserMessageList(user.userId);
    }
    sendMessage() {
        var model = {
            FromUserID: this.Loginuserid,
            ToUserID: this.MessageDetails.value.selectedUser.userId,
            Message: this.MessageDetails.value.Message
        };
        this.sendMessageToUser(model);
    }

    sendMessageToUser(model) {
        this._loaderService.show();
        this.http.post(config.ServiceUrl + '/api/gateway/SaveChatMessage', model, this.httpOptions).subscribe((data) => {
            $("#compose").modal('hide');
            this.MessageDetails.value.Message = null;
            this._hubConnection.invoke("SendMessage", "User", "TEst").catch(er => console.log(er.toString()));
            // this._hubConnection.invoke('Send', 'Test');
            // setTimeout(() => {
            //     this._loaderService.hide();
            // }, 2000);
        });
    }

    closeMessageDetails() {
        this.openMessageDetails = false;
    }

    getUserMessageList(userID) {
        this._loaderService.show();
        this.http.get<object[]>(config.ServiceUrl + '/api/gateway/GetChatMessages?fromuserId=' + this.Loginuserid + '&toUserId=' + userID, this.httpOptions).subscribe((data) => {
            //this.userList = data != null ? data.map(a => new Objectct(a)) : [];
            this.userMessageList = data != null ? data : [];
            // this.userList = data
            // _.each(this.userList, function (user) {
            //     if (user.lastUpdationTime != "") {
            //         user.lastUpdationTimeString = moment(user.lastUpdationTime, 'YYYY/MM/DD');
            //     }
            //     user.fullName = user.userFirstName + " " + user.userLastName;
            // });
            setTimeout(() => {
                this._loaderService.hide();
            }, 2000);
        });
    }

    sendMessageFromDetails() {
        var model = {
            FromUserID: this.Loginuserid,
            ToUserID: this.selectedUserDetails.userId,
            Message: this.MessageDetails.value.Message
        };
        this.sendMessageToUser(model);
    }


}
