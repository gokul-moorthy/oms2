import { OmsService } from './../_services/oms.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private oms: OmsService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let token = localStorage.getItem('token')
        if (token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer: ${token}`,
                    'x-access-token': token
                }
            });
        }
        return next.handle(request);
    }
}