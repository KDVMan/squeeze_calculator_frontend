import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ConfigService } from '@core/services/config.service';
import { PaginationService } from '@core/services/pagination.service';
import { CalculateComponent } from '@app/components/exec/calculate/calculate.component';
import { InitSenderEnum } from '@app/enums/init/init-sender.enum';
import { InitService } from '@app/services/init/init.service';
import { ExecActiveEnum } from '@app/enums/exec/exec-active.enum';

@Component({
	selector: 'app-exec',
	templateUrl: './exec.component.html',
	styleUrl: './exec.component.scss',
	standalone: true,
	imports: [CommonModule, NgbNavModule, CalculateComponent]
})
export class ExecComponent implements OnInit {
	protected active: ExecActiveEnum;
	protected total$: Observable<number>;
	protected page$: Observable<number>;
	protected toggleStates: { [key: string]: boolean };

	constructor(protected readonly configService: ConfigService,
				private readonly paginationService: PaginationService,
				private readonly initService: InitService) {
	}

	public ngOnInit(): void {
		this.active = this.initService.model.execActive || ExecActiveEnum.bot;
		this.total$ = this.paginationService.totalSubject;
		this.page$ = this.paginationService.pageSubject;

		// this.toggleStates = {
		//     run: this.settingsInitService.botListShowBot('run'),
		//     archive: this.settingsInitService.botListShowBot('archive')
		// };
	}

	public onToggle(): void {
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
