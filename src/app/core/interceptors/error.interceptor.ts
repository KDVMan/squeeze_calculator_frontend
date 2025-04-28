import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DictionaryService } from '@core/services/dictionary.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private readonly dictionaryService: DictionaryService,
                private readonly toastService: ToastrService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //const preloader = this.injector.get(PreloaderService);
        //preloader.show();

        return next.handle(req).pipe(
            //tap(() => preloader.hide()),
            catchError((response: any) => {
                if (response instanceof HttpErrorResponse) this.handleError(response);
                //preloader.hide();

                throw new Error(response);
            })
        );
    }

    private handleError(response: HttpErrorResponse): void {
        if (response.status === 0) {
            this.doError('default');
        } else if (this.isConfig(response)) {
            this.doError('config_not_found');
            // } else if (response.error.message === 'quote.invalid_symbol') {
            // 	this.doError(response.error.message);
        } else {
            this.doError('default');
        }
    }

    private isConfig(response: HttpErrorResponse): boolean {
        if (response && response.url) {
            const url = response.url.split('/');
            return url[url.length - 1] === 'config.json';
        }

        return false;
    }

    private doError(error: string): void {
        this.toastService.error(this.dictionaryService.get(error), '', {
            timeOut: 5000,
            tapToDismiss: true,
            progressBar: true
        });
    }
}




