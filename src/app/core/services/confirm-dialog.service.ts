import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConfirmDialogModel } from '@core/models/confirm-dialog.model';

@Injectable({
	providedIn: 'root'
})
export class ConfirmDialogService {
	private subject = new Subject<ConfirmDialogModel>();

	public getConfirm(): Observable<ConfirmDialogModel> {
		return this.subject.asObservable();
	}

	public confirm(message: string, yesFunction: () => void, noFunction: () => void): void {
		const that = this;

		this.subject.next({
			message: message,
			yesFunction(): any {
				that.subject.next(null);
				yesFunction();
			},
			noFunction(): any {
				that.subject.next(null);
				noFunction();
			}
		});
	}
}
