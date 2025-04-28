import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, first, Observable } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { CalculatorPresetModel } from '@app/models/calculator-preset/calculator-preset.model';
import {
    CalculatorPresetAddRequestModel,
    CalculatorPresetDeleteRequestModel,
    CalculatorPresetDuplicateRequestModel,
    CalculatorPresetEditRequestModel
} from '@app/models/calculator-preset/calculator-request.model';
import { CalculatorPresetSubjectModel } from '@app/models/calculator-preset/calculator-preset-subject.model';
import { ParamModel } from '@core/models/param.model';
import { CalculatorPresetSenderEnum } from '@app/enums/calculator-preset/calculator-preset-sender.enum';

@Injectable({
    providedIn: 'root'
})
export class CalculatorPresetService {
    public models: CalculatorPresetModel[];
    public updateSubject = new BehaviorSubject<CalculatorPresetSubjectModel>(null);
    public selectedSubject = new BehaviorSubject<CalculatorPresetModel>(null);

    constructor(private readonly httpService: HttpService) {
    }

    public init(models: CalculatorPresetModel[], senders: CalculatorPresetSenderEnum[], params?: ParamModel): void {
        this.models = models;

        this.updateSubject.next({
            models: models,
            senders: senders,
            params: params
        });
    }

    public load(): Observable<CalculatorPresetModel[]> {
        return this.httpService.get<CalculatorPresetModel[]>('calculator_preset/load').pipe(
            first(),
            tap((response: CalculatorPresetModel[]) => {
                this.init(response || [], [CalculatorPresetSenderEnum.load]);
            }),
            catchError((error: HttpErrorResponse) => {
                throw new Error(error.error);
            })
        );
    }

    public add(request: CalculatorPresetAddRequestModel): void {
        this.httpService
            .post<CalculatorPresetAddRequestModel, CalculatorPresetModel[]>('calculator_preset/add', request)
            .pipe(first())
            .subscribe((response: CalculatorPresetModel[]) => {
                this.init(response || [], [CalculatorPresetSenderEnum.add]);
            });
    }

    public edit(request: CalculatorPresetEditRequestModel): void {
        this.httpService
            .post<CalculatorPresetEditRequestModel, CalculatorPresetModel[]>('calculator_preset/edit', request)
            .pipe(first())
            .subscribe((response: CalculatorPresetModel[]) => {
                this.init(response || [], [CalculatorPresetSenderEnum.edit]);
            });
    }

    public duplicate(request: CalculatorPresetDuplicateRequestModel): void {
        this.httpService
            .post<CalculatorPresetDuplicateRequestModel, CalculatorPresetModel[]>('calculator_preset/duplicate', request)
            .pipe(first())
            .subscribe((response: CalculatorPresetModel[]) => {
                this.init(response || [], [CalculatorPresetSenderEnum.duplicate]);
            });
    }

    public delete(request: CalculatorPresetDeleteRequestModel): void {
        this.httpService
            .post<CalculatorPresetDeleteRequestModel, CalculatorPresetModel[]>('calculator_preset/delete', request)
            .pipe(first())
            .subscribe((response: CalculatorPresetModel[]) => {
                this.init(response || [], [CalculatorPresetSenderEnum.delete]);
            });
    }
}
