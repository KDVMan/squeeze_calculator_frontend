import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingPercentComponent } from '@core/components/loading-percent/loading-percent.component';
import { Subscription } from 'rxjs';
import { WebsocketService } from '@core/services/websocket.service';
import { WebsocketStatusEnum } from '@core/enums/websocket-status.enum';
import { WebsocketEventEnum } from '@core/enums/websocket-event.enum';
import { CalculateModel } from '@app/models/calculate/calculate.model';
import { SortDirectionEnum } from '@core/enums/sort-direction.enum';
import { SortIconPipe } from '@core/pipes/sort-icon.pipe';
import { SvgIconComponent } from 'angular-svg-icon';
import { CalculateService } from '@app/services/calculate/calculate.service';
import { CalculatorFieldEnum } from '@app/enums/calculator/calculator-field.enum';
import { InitService } from '@app/services/init/init.service';
import { InitSenderEnum } from '@app/enums/init/init-sender.enum';
import { FormatNumberPipe } from '@core/pipes/format-number.pipe';
import { LoadingSpinnerComponent } from '@core/components/loading-spinner/loading-spinner.component';
import { InitSubjectModel } from '@app/models/init/init-subject.model';
import { CalculatorFormulaPresetService } from '@app/services/calculator-formula-preset/calculator-formula-preset.service';
import { ProgressModel } from '@core/models/progress.model';

@Component({
	selector: 'app-calculate',
	templateUrl: './calculate.component.html',
	styleUrl: './calculate.component.scss',
	standalone: true,
	imports: [CommonModule, FormsModule, LoadingPercentComponent, ReactiveFormsModule, SortIconPipe, SvgIconComponent, FormatNumberPipe, LoadingSpinnerComponent]
})
export class CalculateComponent implements OnInit, OnDestroy {
	public formGroup: FormGroup;
	private subscriptionInit: Subscription;
	private subscriptionProgress: Subscription;
	private subscriptionCalculate: Subscription;
	private subscriptionCalculatorFormulaPreset: Subscription;
	public results: CalculateModel[];
	public progress: ProgressModel = null;
	public readonly statusEnum = WebsocketStatusEnum;
	public sortColumn: CalculatorFieldEnum = CalculatorFieldEnum.score;
	public sortDirection: SortDirectionEnum = SortDirectionEnum.desc;
	public selectedIndex: number | null = null;
	protected loaded: boolean = true;

	public sortFields = [
		{name: 'Привязка', value: CalculatorFieldEnum.bind, sortable: false},
		{name: 'Вх.', value: CalculatorFieldEnum.percentIn, sortable: true},
		{name: 'Вых.', value: CalculatorFieldEnum.percentOut, sortable: true},
		{name: 'Стоп t', value: CalculatorFieldEnum.stopTime, sortable: true},
		{name: 'Стоп %', value: CalculatorFieldEnum.stopPercent, sortable: true},
		{name: 'Сделки', value: CalculatorFieldEnum.total, sortable: true},
		{name: 'Стопы', value: CalculatorFieldEnum.totalStops, sortable: true},
		{name: 'Стопы-', value: CalculatorFieldEnum.totalStopsMinus, sortable: true},
		{name: 'Стопы+', value: CalculatorFieldEnum.totalStopsPlus, sortable: true},
		{name: 'Тейки', value: CalculatorFieldEnum.totalTakes, sortable: true},
		{name: 'Тейки+', value: CalculatorFieldEnum.totalTakesPlus, sortable: true},
		{name: 'Профит', value: CalculatorFieldEnum.totalProfitPercent, sortable: true},
		{name: 'Профит К.', value: CalculatorFieldEnum.totalCumulativeProfitPercent, sortable: true},
		{name: 'М. просадка', value: CalculatorFieldEnum.maxDrawdownPercent, sortable: true},
		{name: 'М. время', value: CalculatorFieldEnum.maxTimeDeal, sortable: true},
		{name: 'Рейт.', value: CalculatorFieldEnum.inOutRatio, sortable: true},
		{name: 'Кф.', value: CalculatorFieldEnum.coefficient, sortable: true},
		{name: 'ВР', value: CalculatorFieldEnum.winRate, sortable: true},
		{name: 'ВР+', value: CalculatorFieldEnum.winRatePlus, sortable: true},
		{name: 'S', value: CalculatorFieldEnum.score, sortable: true}
	];

	constructor(private readonly websocketService: WebsocketService,
				private readonly initService: InitService,
				private readonly calculatorFormulaPresetService: CalculatorFormulaPresetService,
				private readonly calculateService: CalculateService) {
		this.sortDirection = this.initService.model.calculateSortDirection;
		this.sortColumn = this.initService.model.calculateSortColumn;
	}

	public ngOnInit(): void {
		this.subscriptionInit = this.initService.setSubject.subscribe((response: InitSubjectModel) => {
			if (response.senders.some(x => x === InitSenderEnum.symbol || x === InitSenderEnum.execActive)) {
				this.loaded = false;
			}
		});

		this.subscriptionCalculatorFormulaPreset = this.calculatorFormulaPresetService.setSubject.subscribe(_ => {
			this.loaded = false;
		});

		this.subscriptionProgress = this.websocketService.receive<ProgressModel>(WebsocketEventEnum.calculateProgress).subscribe(progress => {
			this.progress = progress;
			if (progress.status == WebsocketStatusEnum.done) this.loaded = false;
		});

		this.subscriptionCalculate = this.websocketService.receive<CalculateModel[]>(WebsocketEventEnum.calculateResult).subscribe(results => {
			this.results = results;
			this.loaded = true;
		});
	}

	public ngOnDestroy(): void {
		if (this.subscriptionInit) this.subscriptionInit.unsubscribe();
		if (this.subscriptionProgress) this.subscriptionProgress.unsubscribe();
		if (this.subscriptionCalculate) this.subscriptionCalculate.unsubscribe();
		if (this.subscriptionCalculatorFormulaPreset) this.subscriptionCalculatorFormulaPreset.unsubscribe();
	}

	public onSort(column: string): void {
		this.loaded = false;

		if (column && Object.values(CalculatorFieldEnum).includes(column as CalculatorFieldEnum)) {
			if (column === this.sortColumn) {
				this.sortDirection = this.sortDirection === SortDirectionEnum.asc ? SortDirectionEnum.desc : SortDirectionEnum.asc;
			} else {
				this.sortColumn = column as CalculatorFieldEnum;
				this.sortDirection = SortDirectionEnum.asc;
			}
		}

		this.initService.update({
			calculateSortColumn: this.sortColumn,
			calculateSortDirection: this.sortDirection
		}, [InitSenderEnum.calculateSort]);
	}

	public onClick(index: number): void {
		this.selectedIndex = index;
		this.calculateService.update(index);
	}
}
