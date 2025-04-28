import { HttpService } from '@core/services/http.service';
import { Injectable } from '@angular/core';
import { catchError, first, Observable, tap } from 'rxjs';
import { InitVariableModel } from '@app/models/init/init-variable.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class InitVariableService {
    public model: InitVariableModel;

    constructor(private readonly httpService: HttpService) {
    }

    public load(): Observable<InitVariableModel> {
        return this.httpService.get<InitVariableModel>('init/load_variable').pipe(
            first(),
            tap((response: InitVariableModel) => {
                this.model = response;
            }),
            catchError((error: HttpErrorResponse) => {
                throw new Error(error.error);
            })
        );
    }
}
