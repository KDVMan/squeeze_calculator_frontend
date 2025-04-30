import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { PaginationService } from '@core/services/pagination.service';
import { CalculateComponent } from '@app/components/exec/calculate/calculate.component';
import { InitSenderEnum } from '@app/enums/init/init-sender.enum';
import { InitService } from '@app/services/init/init.service';
import { ExecActiveEnum } from '@app/enums/exec/exec-active.enum';
import { BotModel } from '@app/models/bot/bot.model';
import { BotListComponent } from '@app/components/exec/bot-list/bot-list.component';

@Component({
	selector: 'app-exec',
	templateUrl: './exec.component.html',
	styleUrl: './exec.component.scss',
	standalone: true,
	imports: [CommonModule, NgbNavModule, CalculateComponent, BotListComponent]
})
export class ExecComponent implements OnInit {
	private readonly initService = inject(InitService);
	private readonly paginationService = inject(PaginationService);
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

		this.toggleStates = {
			// run: this.settingsInitService.botListShowBot('run'),
			// archive: this.settingsInitService.botListShowBot('archive')
		};
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
