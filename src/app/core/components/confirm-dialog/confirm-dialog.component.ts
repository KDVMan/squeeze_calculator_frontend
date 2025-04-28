import { Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmDialogModel } from '@core/models/confirm-dialog.model';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { NgIf } from '@angular/common';

@Component({
	selector: 'app-confirm-dialog',
	templateUrl: './confirm-dialog.component.html',
	styleUrl: './confirm-dialog.component.scss',
	imports: [
		NgIf
	],
	standalone: true
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
	private subscription: Subscription;
	public confirmDialog: ConfirmDialogModel;

	constructor(private renderer: Renderer2,
				private confirmDialogService: ConfirmDialogService) {
	}

	public ngOnInit(): void {
		this.subscription = this.confirmDialogService.getConfirm().subscribe((response: ConfirmDialogModel) => {
			this.confirmDialog = response;
		});
	}

	public ngOnDestroy(): void {
		if (this.subscription) this.subscription.unsubscribe();
	}

	@HostListener('document:keydown.escape', ['$event'])
	public onKeydownHandler(event: KeyboardEvent) {
		if (this.confirmDialog) this.confirmDialog.noFunction();
	}
}
