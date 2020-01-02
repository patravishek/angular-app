import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HttpTransportType, LogLevel } from '@aspnet/signalr';
import { Router } from '@angular/router';
import { config } from '../../config/config';
import { AnimationKeyframesSequenceMetadata } from '@angular/animations';

//declare var $: any;
@Injectable()
export class SignalRService {
    messageReceived: any; //new EventEmitter<LoginMessage>();
    connectionEstablished = new EventEmitter<Boolean>();
    public signalRUrl = config.ServiceUrl;
    counter = 0;
    IsConnected = false;
    public isMultipleLogin = false;
    private connectionIsEstablished = false;
    private _hubConnection: HubConnection;
    private proxy: any;
    Loginuserid: any;
    Token: any;

    constructor(private _router: Router) {

        this.Token = window.localStorage.getItem('token');
        this.Loginuserid = window.localStorage.getItem('id');
        if (this.Token && this.Loginuserid) {
            this.createConnection();
            //this.registerOnServerEvents();
            this.startConnection();
        }

    }

    public createConnection() {

        this._hubConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:44391/MyChatHub?UserID=" + this.Loginuserid + "&token=" + this.Token, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .configureLogging(LogLevel.Debug)
            .build();

    }

    public startConnection(): void {
        this._hubConnection
            .start()
            .then(() => {
                console.log('Hub connection started');
                this.connectionEstablished.next(true);
                if (this.Token && this.Loginuserid) {
                    this._hubConnection.invoke('RefreshOnlineUsers?userID=' + this.Loginuserid + "&token=" + this.Token);
                }
                //this.GetOnlineUserList();
            })
            .catch(err => {
                console.log('Error while establishing connection, retrying...');
                setTimeout(() => this.startConnection(), 5000);
            });
    }

    private registerOnServerEvents(): void {
        this._hubConnection.on('ReceiveMessage', (userId: any, loginSessionID: any) => {
            let userDetail = JSON.parse(localStorage.getItem('userDetail'));
            if (userDetail instanceof Object) {
                if (userDetail.id == userId && userDetail.loginSessionID && (userDetail.loginSessionID != loginSessionID)) {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('userDetail');
                    this._router.navigate(['/logout']);
                    this.isMultipleLogin = true;
                }
            }
        });
    }
    createGroup(): void {
        if (this.connectionIsEstablished) {
            let userDetail = JSON.parse(localStorage.getItem('userDetail'));
            let userID = ((userDetail instanceof Object) && userDetail.id) ? userDetail.id : "";
            if (userID) {
                this._hubConnection.invoke('CreateGroup', userID);
                this._hubConnection.invoke('SendMessage', userID, userDetail.loginSessionID);
            }
        }
    }

    public GetOnlineUserList() {
        this._hubConnection.on('RefreshOnlineUsers', (data) => {
            console.log(data);
        })
    }
}  