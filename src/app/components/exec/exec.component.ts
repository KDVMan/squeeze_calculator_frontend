import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { PaginationService } from '@core/services/pagination.service';
import { CalculateComponent } from '@app/components/exec/calculate/calculate.component';
import { InitSenderEnum } from '@app/enums/init/init-sender.enum';
import { InitService } from '@app/services/init/init.service';
import { ExecActiveEnum } from '@app/enums/exec/exec-active.enum';
import { BotModel } from '@app/models/bot/bot.model';
import { BotListComponent } from '@app/components/exec/bot-list/bot-list.component';
import { ActionService } from '@core/services/action.service';
import { ActionEnum } from '@core/enums/action.enum';

@Component({
	selector: 'app-exec',
	templateUrl: './exec.component.html',
	styleUrl: './exec.component.scss',
	standalone: true,
	imports: [CommonModule, NgbNavModule, CalculateComponent, BotListComponent]
})
export class ExecComponent implements OnInit, OnDestroy {
	private readonly actionService = inject(ActionService);
	private readonly initService = inject(InitService);
	private readonly paginationService = inject(PaginationService);
	private subscriptionAction: Subscription;
	protected active: ExecActiveEnum;
	protected total$: Observable<number>;
	protected page$: Observable<number>;
	protected toggleStates: { [key: string]: boolean };
	public results: BotModel[] = [];
	protected loaded: boolean = true;

	public ngOnInit(): void {
		this.active = this.initService.model.execActive || ExecActiveEnum.botList;
		this.total$ = this.paginationService.totalSubject;
		this.page$ = this.paginationService.pageSubject;

		this.subscriptionAction = this.actionService.updateSubject.subscribe(result => {
			if (result.action === ActionEnum.calculatorCalculate) {
				this.active = ExecActiveEnum.calculate;
				this.onTabChange(this.active);
			} else if (result.action === ActionEnum.calculatorStart) {
				this.active = ExecActiveEnum.botList;
				this.onTabChange(this.active);
			}
		});

		this.toggleStates = {
			// run: this.settingsInitService.botListShowBot('run'),
			// archive: this.settingsInitService.botListShowBot('archive')
		};
	}

	public ngOnDestroy(): void {
		if (this.subscriptionAction) this.subscriptionAction.unsubscribe();
	}

	public onToggle(): void {
		console.log('onToggle');
		// this.toggleStates[this.active] = this.botListToggleService.toggle(this.active);
		// this.settingsInitService.botListToggle(this.active, this.toggleStates[this.active]);
	}

	public onPage(page: number) {
		this.paginationService.setPage(page);
	}

	public onTabChange(active: ExecActiveEnum): void {
		this.initService.update({
			execActive: active
		}, [InitSenderEnum.execActive]);
	}
}
