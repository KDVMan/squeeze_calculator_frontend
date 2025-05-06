import { Injectable } from '@angular/core';
import { catchError, first, Observable } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BotStartRequestModel } from '@app/models/bot/bot-start-request.model';
import { BotUpdateStatusRequestModel } from '@app/models/bot/bot-update-status-request.model';
import { BotUpdateRequestModel } from '@app/models/bot/bot-update-request.model';
import { BotActionRequestModel } from '@app/models/bot/bot-action-request.model';

@Injectable({
	providedIn: 'root'
})
export class BotService {
	constructor(private readonly httpService: HttpService) {
	}

	public start(request: BotStartRequestModel): Observable<void> {
		return this.httpService.post<BotStartRequestModel, void>('bot/start', request).pipe(
			first(),
			catchError((error: HttpErrorResponse) => {
				throw new Error(error.error);
			})
		);
	}

	public update(request: BotUpdateRequestModel): Observable<void> {
		return this.httpService.post<BotUpdateRequestModel, void>('bot/update', request).pipe(
			first(),
			catchError((error: HttpErrorResponse) => {
				throw new Error(error.error);
			})
		);
	}

	public updateStatus(request: BotUpdateStatusRequestModel): Observable<void> {
		return this.httpService.post<BotUpdateStatusRequestModel, void>('bot/update_status', request).pipe(
			first(),
			catchError((error: HttpErrorResponse) => {
				throw new Error(error.error);
			})
		);
	}

	public action(request: BotActionRequestModel): Observable<void> {
		return this.httpService.post<BotActionRequestModel, void>('bot/action', request).pipe(
			first(),
			catchError((error: HttpErrorResponse) => {
				throw new Error(error.error);
			})
		);
	}
}
