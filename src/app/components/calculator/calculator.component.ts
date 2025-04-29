import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitSubjectModel } from '@app/models/init/init-subject.model';
import { InitSenderEnum } from '@app/enums/init/init-sender.enum';
import { WebsocketEventEnum } from '@core/enums/websocket-event.enum';
import { Subscription } from 'rxjs';
import { WebsocketService } from '@core/services/websocket.service';
import { InitService } from '@app/services/init/init.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingPercentComponent } from '@core/components/loading-percent/loading-percent.component';
import { ProgressModel } from '@core/models/progress.model';
import { WebsocketStatusEnum } from '@core/enums/websocket-status.enum';
import { lesserThanValidator } from '@core/validators/lesser-than.validator';
import { greaterThanValidator } from '@core/validators/greater-than.validator';
import { greaterThanZeroValidator } from '@core/validators/greated-than-zero.validator';
import { CalculatorHeaderComponent } from '@app/components/calculator/calculator-header/calculator-header.component';
import { CalculatorParamLeftComponent } from '@app/components/calculator/calculator-param-left/calculator-param-left.component';
import { CalculatorParamRightComponent } from '@app/components/calculator/calculator-param-right/calculator-param-right.component';
import { CalculatorPanelComponent } from '@app/components/calculator/calculator-formula-left/calculator-formula-left.component';
import { CalculatorTemplateComponent } from '@app/components/calculator/calculator-formula-right/calculator-formula-right.component';
import { leastOneCheckedValidator } from '@core/validators/least-one-field.validator';

@Component({
	selector: 'app-calculator',
	templateUrl: './calculator.component.html',
	styleUrl: './calculator.component.scss',
	standalone: true,
	imports: [
		CommonModule, LoadingPercentComponent, CalculatorHeaderComponent, CalculatorParamLeftComponent,
		CalculatorParamRightComponent, CalculatorPanelComponent, CalculatorTemplateComponent
	]
})
export class CalculatorComponent implements OnInit, OnDestroy {
	private readonly formBuilder = inject(FormBuilder);
	private readonly websocketService = inject(WebsocketService);
	private readonly initService = inject(InitService);
	public formGroup: FormGroup;
	private subscriptionInit: Subscription;
	private subscriptionProgress: Subscription;
	public progress: ProgressModel = null;
	public readonly statusEnum = WebsocketStatusEnum;

	public ngOnInit(): void {
		this.createForm();
		this.load();

		this.subscriptionInit = this.initService.updateSubject.subscribe((response: InitSubjectModel) => {
			if (response.senders.some(x => x === InitSenderEnum.symbol)) {
				this.load();
			}
		});

		this.subscriptionProgress = this.websocketService.receive<ProgressModel>(WebsocketEventEnum.calculateProgress).subscribe(progress => {
			this.progress = progress;
		});
	}

	public ngOnDestroy(): void {
		if (this.subscriptionInit) this.subscriptionInit.unsubscribe();
		if (this.subscriptionProgress) this.subscriptionProgress.unsubscribe();
	}

	private createForm(): void {
		const pairs = [
			{from: 'percentInFrom', to: 'percentInTo'},
			{from: 'percentOutFrom', to: 'percentOutTo'},
			{from: 'stopTimeFrom', to: 'stopTimeTo'},
			{from: 'stopPercentFrom', to: 'stopPercentTo'}
		];

		this.formGroup = this.formBuilder.group({
			date: ['', [Validators.required]],
			window: ['', [Validators.required, greaterThanZeroValidator()]],
			tradeDirection: ['', Validators.required],
			interval: ['', Validators.required],
			bind: ['', Validators.required],
			percentInFrom: ['', [Validators.required, greaterThanZeroValidator(), lesserThanValidator('percentInTo')]],
			percentInTo: ['', [Validators.required, greaterThanValidator('percentInFrom')]],
			percentInStep: ['', Validators.required],
			percentOutFrom: ['', [Validators.required, greaterThanZeroValidator(), lesserThanValidator('percentOutTo')]],
			percentOutTo: ['', [Validators.required, greaterThanValidator('percentOutFrom')]],
			percentOutStep: ['', Validators.required],
			stopTime: ['', Validators.required],
			stopTimeFrom: ['', [Validators.required, lesserThanValidator('stopTimeTo')]],
			stopTimeTo: ['', [Validators.required, greaterThanValidator('stopTimeFrom')]],
			stopTimeStep: ['', Validators.required],
			stopPercent: ['', Validators.required],
			stopPercentFrom: ['', [Validators.required, lesserThanValidator('stopPercentTo')]],
			stopPercentTo: ['', [Validators.required, greaterThanValidator('stopPercentFrom')]],
			stopPercentStep: ['', Validators.required],
			algorithm: ['', Validators.required],
			iterations: ['', [Validators.required, greaterThanZeroValidator()]]
		}, {
			validators: [leastOneCheckedValidator(['stopTime', 'stopPercent'])]
		});

		pairs.forEach(pair => {
			this.formGroup.get(pair.to).valueChanges.subscribe(() => {
				this.formGroup.get(pair.from).updateValueAndValidity({onlySelf: true, emitEvent: false});
			});

			this.formGroup.get(pair.from).valueChanges.subscribe(() => {
				this.formGroup.get(pair.to).updateValueAndValidity({onlySelf: true, emitEvent: false});
			});
		});
	}

	private load(): void {
		// const request: CalculatorLoadRequestModel = {
		//     symbol: this.initService.model.symbol
		// };

		// this.calculatorService.load(request)
		//     .pipe(first())
		//     .subscribe(_ => this.loaded = true);
	}
}
