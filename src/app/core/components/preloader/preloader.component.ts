import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PreloaderService } from '@core/services/preloader.service';
import { PreloaderModel } from '@core/models/preloader.model';

@Component({
	selector: 'app-preloader',
	templateUrl: './preloader.component.html',
	styleUrl: './preloader.component.scss',
	standalone: true,
	imports: [CommonModule]
})
export class PreloaderComponent implements OnInit, OnDestroy {
	private subscription: Subscription;
	public show: boolean = false;

	constructor(private preloaderService: PreloaderService) {
	}

	ngOnInit(): void {
		this.subscription = this.preloaderService.subject.subscribe(
			(preloaderModel: PreloaderModel) => {
				this.show = preloaderModel.show;
			}
		);
	}

	ngOnDestroy(): void {
		if (this.subscription) this.subscription.unsubscribe();
	}
}
