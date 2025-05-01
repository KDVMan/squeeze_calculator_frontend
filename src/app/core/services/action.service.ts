import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ActionModel } from '@core/models/action.model';

@Injectable({
	providedIn: 'root'
})
export class ActionService {
	public updateSubject = new Subject<ActionModel>();

	public update(action: ActionModel): void {
		this.updateSubject.next(action);
	}
}
