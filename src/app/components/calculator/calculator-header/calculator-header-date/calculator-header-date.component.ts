import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeIntl, OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { Subscription } from 'rxjs';
import { CalculatorPresetModel } from '@app/models/calculator-preset/calculator-preset.model';
import { CalculatorPresetService } from '@app/services/calculator-preset/calculator-preset.service';

@Component({
	selector: 'app-calculator-header-date',
	templateUrl: './calculator-header-date.component.html',
	styleUrl: './calculator-header-date.component.scss',
	standalone: true,
	imports: [ReactiveFormsModule, OwlDateTimeModule]
})
export class CalculatorHeaderDateComponent implements OnInit, OnDestroy {
	@Input() formGroup: FormGroup;
	private subscription: Subscription;

	constructor(private readonly owlDateTimeIntl: OwlDateTimeIntl,
				private readonly calculatorPresetService: CalculatorPresetService) {
		this.owlDateTimeIntl.rangeFromLabel = 'От';
		this.owlDateTimeIntl.rangeToLabel = 'До';
		this.owlDateTimeIntl.cancelBtnLabel = 'Отмена';
		this.owlDateTimeIntl.setBtnLabel = 'Принять';
	}

	public ngOnInit(): void {
		this.subscription = this.calculatorPresetService.selectedSubject.subscribe((response: CalculatorPresetModel) => {
			if (response?.timeTo > 0) this.formGroup.get('date').patchValue(new Date(response['timeTo']));
		});
	}

	public onClick(event: any): void {
		if (event.which === 2) {
			this.formGroup.get('date').setValue([]);
		}
	}

	public ngOnDestroy(): void {
		if (this.subscription) this.subscription.unsubscribe();
	}
}
