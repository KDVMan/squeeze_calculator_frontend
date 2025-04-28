import { HttpService } from '@core/services/http.service';
import { Injectable } from '@angular/core';
import { first, Observable, Subject, tap } from 'rxjs';
import { ParamModel } from '@core/models/param.model';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { SymbolListModel } from '@app/models/symbol-list/symbol-list.model';
import { SymbolListSubjectModel } from '@app/models/symbol-list/symbol-list-subject.model';
import { SymbolListUpdateModel } from '@app/models/symbol-list/symbol-list-update.model';
import { SymbolListSenderEnum } from '@app/enums/symbol-list/symbol-list-sender.enum';

@Injectable({
    providedIn: 'root'
})
export class SymbolListService {
    public model: SymbolListModel;
    public updateModel: SymbolListSubjectModel;
    public updateSubject = new Subject<SymbolListSubjectModel>();

    constructor(private readonly httpService: HttpService) {
    }

    public load(): Observable<SymbolListModel> {
        return this.httpService.get<SymbolListModel>('symbol_list/load').pipe(
            first(),
            tap((response: SymbolListModel) => {
                this.model = response;
            }),
            catchError((error: HttpErrorResponse) => {
                throw new Error(error.error);
            })
        );
    }

    public update(data: SymbolListUpdateModel, senders: SymbolListSenderEnum[], params?: ParamModel): void {
        Object.assign(this.model, data);

        this.httpService
            .post<SymbolListModel, SymbolListModel>('symbol_list/update', this.model)
            .pipe(first())
            .subscribe((model: SymbolListModel) => {
                this.model = model;

                this.updateModel = {
                    model: model,
                    senders: senders,
                    params: params
                };

                this.updateSubject.next(this.updateModel);
            });
    }
}
