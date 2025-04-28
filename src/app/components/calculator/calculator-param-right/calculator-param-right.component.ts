import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CalculatorPresetService } from '@app/services/calculator-preset/calculator-preset.service';
import { CalculatorPresetModel } from '@app/models/calculator-preset/calculator-preset.model';
import { CalculatorParamWindowComponent } from '@app/components/calculator/calculator-param-right/calculator-param-window/calculator-param-window.component';
import { CalculatorParamDirectionComponent } from '@app/components/calculator/calculator-param-right/calculator-param-direction/calculator-param-direction.component';
import { CalculatorParamIntervalComponent } from '@app/components/calculator/calculator-param-right/calculator-param-interval/calculator-param-interval.component';
import { CalculatorParamAlgorithmComponent } from '@app/components/calculator/calculator-param-right/calculator-param-algorithm/calculator-param-algorithm.component';
import { CalculatorParamIterationComponent } from '@app/components/calculator/calculator-param-right/calculator-param-iteration/calculator-param-iteration.component';
import { CalculatorParamBindComponent } from '@app/components/calculator/calculator-param-right/calculator-param-bind/calculator-param-bind.component';
import { CalculatorParamInComponent } from '@app/components/calculator/calculator-param-right/calculator-param-in/calculator-param-in.component';
import { CalculatorParamOutComponent } from '@app/components/calculator/calculator-param-right/calculator-param-out/calculator-param-out.component';
import { CalculatorParamStopTimeComponent } from '@app/components/calculator/calculator-param-right/calculator-param-stop-time/calculator-param-stop-time.component';
import { CalculatorParamStopPercentComponent } from '@app/components/calculator/calculator-param-right/calculator-param-stop-percent/calculator-param-stop-percent.component';

@Component({
	selector: 'app-calculator-param-right',
	templateUrl: './calculator-param-right.component.html',
	standalone: true,
	imports: [
		CommonModule, ReactiveFormsModule, CalculatorParamWindowComponent, CalculatorParamDirectionComponent, CalculatorParamIntervalComponent,
		CalculatorParamAlgorithmComponent, CalculatorParamIterationComponent, CalculatorParamBindComponent, CalculatorParamInComponent, CalculatorParamOutComponent, CalculatorParamStopTimeComponent, CalculatorParamStopPercentComponent
	]
})
export class CalculatorParamRightComponent implements OnInit, OnDestroy {
	@Input() formGroup: FormGroup;
	private subscription: Subscription;
	protected show: boolean = false;

	constructor(private readonly calculatorPresetService: CalculatorPresetService) {
	}

	public ngOnInit(): void {
		this.subscription = this.calculatorPresetService.selectedSubject.subscribe((response: CalculatorPresetModel) => {
			this.show = !!response;
		});
	}

	public ngOnDestroy(): void {
		if (this.subscription) this.subscription.unsubscribe();
	}
}
