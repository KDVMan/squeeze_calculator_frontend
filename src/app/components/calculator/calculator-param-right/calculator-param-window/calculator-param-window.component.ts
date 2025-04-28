import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormInputNumberComponent } from '@core/components/form-input-number/form-input-number.component';
import { CommonModule } from '@angular/common';
import { CalculatorPresetService } from '@app/services/calculator-preset/calculator-preset.service';
import { CalculatorPresetModel } from '@app/models/calculator-preset/calculator-preset.model';
import { MinuteDisplayPipe } from '@core/pipes/minute-display.pipe';

@Component({
	selector: 'app-calculator-param-window',
	templateUrl: './calculator-param-window.component.html',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, FormInputNumberComponent, MinuteDisplayPipe]
})
export class CalculatorParamWindowComponent implements OnInit, OnDestroy {
	@Input() formGroup: FormGroup;
	private subscription: Subscription;

	constructor(private readonly calculatorPresetService: CalculatorPresetService) {
	}

	public ngOnInit(): void {
		this.subscription = this.calculatorPresetService.selectedSubject.subscribe((response: CalculatorPresetModel) => {
			if (response) {
				this.formGroup.get('window').patchValue(response.window);
			}
		});
	}

	public ngOnDestroy(): void {
		if (this.subscription) this.subscription.unsubscribe();
	}
}
