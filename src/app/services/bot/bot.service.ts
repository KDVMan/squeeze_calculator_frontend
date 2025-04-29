import { Injectable } from '@angular/core';
import { catchError, first, Observable } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BotStartRequestModel } from '@app/models/bot/bot-start-request.model';

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
}
