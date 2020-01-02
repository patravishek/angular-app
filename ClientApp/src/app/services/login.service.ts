import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { _ } from 'underscore';
import { DatePipe } from '@angular/common';
import {CommonService} from '../Common/Commonservice';
import {config}from  '../../config/config';

@Injectable()
export class LoginService {
  constructor(private _CommonService:CommonService) {
   }
   CheckEmail(email){
    return this._CommonService.get(config.ServiceUrl + '/api/gateway/email/'+email)  
            .map((response: Response) => response)  
              
   }
}
