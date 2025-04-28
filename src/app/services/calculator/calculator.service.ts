import { Injectable } from '@angular/core';
import { catchError, first, Observable } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CalculateCalculateRequestModel } from '@app/models/calculator/calculator-calculate-request.model';

@Injectable({
    providedIn: 'root'
})
export class CalculatorService {
    constructor(private readonly httpService: HttpService) {
    }

    public calculate(request: CalculateCalculateRequestModel): Observable<void> {
        return this.httpService.post<CalculateCalculateRequestModel, void>('calculator/calculate', request).pipe(
            first(),
            catchError((error: HttpErrorResponse) => {
                throw new Error(error.error);
            })
        );
    }
}
