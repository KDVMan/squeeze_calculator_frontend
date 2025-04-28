import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HelperService } from '@core/services/helper.service';
import { BindEnum } from '@core/enums/bind.enum';
import { NgForOf } from '@angular/common';
import { KeyValueModel } from '@core/models/key-value.model';
import { CalculatorPresetModel } from '@app/models/calculator-preset/calculator-preset.model';
import { CalculatorPresetService } from '@app/services/calculator-preset/calculator-preset.service';

@Component({
	selector: 'app-calculator-param-bind',
	templateUrl: './calculator-param-bind.component.html',
	styleUrl: './calculator-param-bind.component.scss',
	standalone: true,
	imports: [ReactiveFormsModule, NgForOf]
})
export class CalculatorParamBindComponent implements OnInit, OnDestroy {
	@Input() formGroup: FormGroup;
	private subscription: Subscription;
	public binds: KeyValueModel[];

	constructor(private readonly calculatorPresetService: CalculatorPresetService) {
		this.binds = HelperService.convertEnumToKeyValue(BindEnum);
	}

	public ngOnInit(): void {
		this.subscription = this.calculatorPresetService.selectedSubject.subscribe((response: CalculatorPresetModel) => {
			if (response) {
				this.formGroup.get('bind').patchValue(response.bind);
			}
		});
	}

	public ngOnDestroy(): void {
		if (this.subscription) this.subscription.unsubscribe();
	}
}
