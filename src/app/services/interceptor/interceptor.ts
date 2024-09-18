import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalStorageService } from "../local-storage.service";
import { Injectable } from "@angular/core";

const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor(private localStorageService: LocalStorageService) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        const token = this.localStorageService.getToken();
        if (token != null) {
            authReq = req.clone({
                headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)
            });
        }
        console.log('Intercepted request:', authReq);
        return next.handle(authReq);
    }
}
export const authInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true }
];