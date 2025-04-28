import { Injectable } from '@angular/core';
import { catchError, first, Observable } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SymbolDownloadService {
    constructor(private readonly httpService: HttpService) {
    }

    public download(): Observable<void> {
        return this.httpService.get<void>('symbol/download').pipe(
            first(),
            catchError((error: HttpErrorResponse) => {
                throw new Error(error.error);
            })
        );
    }
}
