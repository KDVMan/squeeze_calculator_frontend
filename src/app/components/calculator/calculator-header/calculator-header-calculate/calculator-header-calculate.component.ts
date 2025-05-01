import { Component, inject, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { first } from 'rxjs';
import { CalculatorService } from '@app/services/calculator/calculator.service';
import { CalculateCalculateRequestModel } from '@app/models/calculator/calculator-calculate-request.model';
import { CalculatorPresetService } from '@app/services/calculator-preset/calculator-preset.service';
import { InitService } from '@app/services/init/init.service';
import { ActionService } from '@core/services/action.service';
import { ActionEnum } from '@core/enums/action.enum';

@Component({
	selector: 'app-calculator-header-calculate',
	templateUrl: './calculator-header-calculate.component.html',
	styleUrl: './calculator-header-calculate.component.scss',
	standalone: true
})
export class CalculatorHeaderCalculateComponent {
	@Input() formGroup: FormGroup;
	private readonly actionService = inject(ActionService);
	private readonly initService = inject(InitService);
	private readonly calculatorService = inject(CalculatorService);
	private readonly calculatorPresetService = inject(CalculatorPresetService);

	public onClick(): void {
		const request: CalculateCalculateRequestModel = {
			id: this.calculatorPresetService.models.find(preset => preset.selected).id,
			symbol: this.initService.model.symbol,
			window: Number(this.formGroup.get('window').value),
			tradeDirection: this.formGroup.get('tradeDirection').value,
			interval: this.formGroup.get('interval').value,
			timeTo: new Date(this.formGroup.get('date').value).getTime(),
			bind: this.formGroup.get('bind').value,
			percentInFrom: Number(this.formGroup.get('percentInFrom').value),
			percentInTo: Number(this.formGroup.get('percentInTo').value),
			percentInStep: Number(this.formGroup.get('percentInStep').value),
			percentOutFrom: Number(this.formGroup.get('percentOutFrom').value),
			percentOutTo: Number(this.formGroup.get('percentOutTo').value),
			percentOutStep: Number(this.formGroup.get('percentOutStep').value),
			stopTime: this.formGroup.get('stopTime').value,
			stopTimeFrom: Number(this.formGroup.get('stopTimeFrom').value),
			stopTimeTo: Number(this.formGroup.get('stopTimeTo').value),
			stopTimeStep: Number(this.formGroup.get('stopTimeStep').value),
			stopPercent: this.formGroup.get('stopPercent').value,
			stopPercentFrom: Number(this.formGroup.get('stopPercentFrom').value),
			stopPercentTo: Number(this.formGroup.get('stopPercentTo').value),
			stopPercentStep: Number(this.formGroup.get('stopPercentStep').value),
			algorithm: this.formGroup.get('algorithm').value,
			iterations: Number(this.formGroup.get('iterations').value)
		};

		this.actionService.update({
			action: ActionEnum.calculatorCalculate
		});

		this.calculatorService.calculate(request)
			.pipe(first())
			.subscribe();
	}
}
