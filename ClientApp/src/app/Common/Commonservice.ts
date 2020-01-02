import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient, HttpHeaders, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CommonService {
    //public loginUser = localStorage.getItem('loginUser');
    public config = {};
    public userData: any = {};
    public loading: any;

    constructor(
        public http: HttpClient,
        public router: Router,
        public spinner: NgxSpinnerService
    ) { }

    private prepareHeader(headers: HttpHeaders | null): object {
        headers = headers || new HttpHeaders();

        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Accept', 'application/json');

        return {
            headers: headers
        }
    }

    get<T>(url: string, headers?: HttpHeaders | null): Observable<T> {
        const expandedHeaders = this.prepareHeader(headers);
        return this.http.get<T>(url, expandedHeaders)
    }

    post(url: string, body: any, headers?: HttpHeaders | null): Observable<any> {
        const expandedHeaders = this.prepareHeader(headers);
        return this.http.post(url, body, expandedHeaders);
    }

  
    public handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        //  console.log(errMsg);
        return Observable.throw(errMsg);
    }

    //show loader 
    public showLoading() {
        this.spinner.show();
    }

    //Hide loader
    public hideLoading() {
        setTimeout(() => {
            /// spinner ends after 5 seconds 
            this.spinner.hide();
        }, 100);
    }
}

