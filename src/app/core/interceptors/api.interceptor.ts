import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ConfigService } from '@core/services/config.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    constructor(private readonly configService: ConfigService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const apiUrl: string = this.configService.get('api.url');
        const isTranslate = request.url.search('assets/i18n') !== -1;
        const isIcon = request.url.search('assets/icons') !== -1;

        if (apiUrl) {
            if (isTranslate || isIcon) {
                return next.handle(request);
            } else {
                const newRequest = request.clone({
                    url: apiUrl + request.url,
                });

                return next.handle(newRequest);
            }
        } else {
            return next.handle(request);
        }
    }
}
