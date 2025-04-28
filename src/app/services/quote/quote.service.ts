import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, first } from 'rxjs/operators';
import { HttpService } from '@core/services/http.service';
import { QuoteResponseModel } from '@app/models/quote/quote-response.model';
import { QuoteRequestModel } from '@app/models/quote/quote-request.model';

@Injectable({
    providedIn: 'root'
})
export class QuoteService {
    constructor(private readonly httpService: HttpService) {
    }

    public load(request: QuoteRequestModel): Observable<QuoteResponseModel> {
        return this.httpService.post<QuoteRequestModel, QuoteResponseModel>('quote/load', request).pipe(
            first(),
            catchError((error: HttpErrorResponse) => {
                throw new Error(error.error);
            })
        );
    }
}
