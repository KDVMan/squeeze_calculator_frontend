import { Injectable } from '@angular/core';
import { catchError, first, Observable } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SymbolSearchRequestModel } from '@app/models/symbol/symbol-search-request.model';

@Injectable({
    providedIn: 'root'
})
export class SymbolSearchService {
    constructor(private readonly httpService: HttpService) {
    }

    public search(request: SymbolSearchRequestModel): Observable<string[]> {
        return this.httpService.post<SymbolSearchRequestModel, string[]>('symbol/search', request).pipe(
            first(),
            catchError((error: HttpErrorResponse) => {
                throw new Error(error.error);
            })
        );
    }
}
