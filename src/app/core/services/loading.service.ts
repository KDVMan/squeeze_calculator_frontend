import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoadingEnum } from '@core/enums/loading.enum';

@Injectable({
	providedIn: 'root'
})
export class LoadingService {
	public subject = new Subject<{ name: LoadingEnum, loading: boolean }>();

	set(name: LoadingEnum, loading: boolean) {
		this.subject.next({name: name, loading: loading});
	}
}
