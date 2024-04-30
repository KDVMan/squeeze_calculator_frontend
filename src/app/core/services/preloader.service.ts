import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PreloaderModel } from '@core/models/preloader.model';

@Injectable({
	providedIn: 'root'
})
export class PreloaderService {
	public subject = new Subject<PreloaderModel>();

	public show(): void {
		this.subject.next(<PreloaderModel>{show: true});
	}

	public hide(timeout: number = 0): void {
		setTimeout(() => {
			this.subject.next(<PreloaderModel>{show: false});
		}, timeout);
	}
}
