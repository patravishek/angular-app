import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import "rxjs/add/operator/do";
import { finalize, tap, map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { MESSAGES } from '../../../src/constants/constants';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private _router: Router, private toaster: ToastrService) {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let token: any = localStorage.getItem('token');
        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) });
        }
        if (!request.headers.has('content-type')) {
            request.headers.set('content-type', 'application/json');
            request.headers.set('accept', 'application/json, text/plain, */*');

        }
        return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                return event;
            }
        },
            (err) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        localStorage.removeItem('token');
                        this._router.navigate(['/']);
                        return err;
                    }
                    else {
                        if (err.error.text == MESSAGES.TokeExpireMessage) {
                            this.toaster.error(MESSAGES.TokeExpireMessage);
                            window.localStorage.clear();
                            this._router.navigate(['/']);

                            setTimeout(function(){
                                window.location.reload(); 
                            },3000);
                            
                           //  $('#signIn').modal('show'); //change index.d.ts of jquery
                        }
                        else
                            return err;
                    }
                }
            })
    }
}