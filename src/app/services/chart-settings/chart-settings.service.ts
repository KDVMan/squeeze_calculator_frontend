import { HttpService } from '@core/services/http.service';
import { Injectable } from '@angular/core';
import { catchError, first, Observable, Subject, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ChartSettingsModel } from '@app/models/chart-settings/chart-settings.model';

@Injectable({
    providedIn: 'root'
})
export class ChartSettingsService {
    public model: ChartSettingsModel;
    private modelDefault: ChartSettingsModel;
    public updateSubject = new Subject<ChartSettingsModel>();

    constructor(private readonly httpService: HttpService) {
    }

    public load(): Observable<ChartSettingsModel> {
        return this.httpService.get<ChartSettingsModel>('chart_settings/load').pipe(
            first(),
            tap((response: ChartSettingsModel) => {
                this.model = response;
            }),
            catchError((error: HttpErrorResponse) => {
                throw new Error(error.error);
            })
        );
    }

    public init(model: ChartSettingsModel, event: boolean = false): void {
        this.model = model;
        this.modelDefault = {...model};
        if (event) this.updateSubject.next(model);
    }

    public save(): Observable<ChartSettingsModel> {
        return this.httpService.post<ChartSettingsModel, ChartSettingsModel>('chart_settings/update', this.model).pipe(
            first(),
            tap((response: ChartSettingsModel) => {
                this.init(response, true);
            }),
            catchError((error: HttpErrorResponse) => {
                throw new Error(error.error);
            })
        );
    }

    // public update(model: ChartSettingsModel): void {
    //     Object.assign(this.model, model);
    //
    //     this.httpService
    //         .post<ChartSettingsModel, ChartSettingsModel>('chart_settings/update', this.model)
    //         .pipe(first())
    //         .subscribe((response: ChartSettingsModel) => {
    //             this.init(response, true);
    //         });
    // }

    public updateModel(model: Partial<ChartSettingsModel>): void {
        this.model = {
            ...this.model,
            ...model
        };

        this.updateSubject.next(this.model);
    }

    public cancel(): void {
        this.updateModel(this.modelDefault);
    }

    public reset(): Observable<ChartSettingsModel> {
        return this.httpService.get<ChartSettingsModel>('chart_settings/reset').pipe(
            first(),
            tap((response: ChartSettingsModel) => {
                this.init(response, true);
            }),
            catchError((error: HttpErrorResponse) => {
                throw new Error(error.error);
            })
        );
    }
}
