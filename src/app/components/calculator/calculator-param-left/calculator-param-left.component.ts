import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CalculatorParamLeftPresetComponent } from '@app/components/calculator/calculator-param-left/calculator-param-left-preset/calculator-param-left-preset.component';

@Component({
	selector: 'app-calculator-param-left',
	templateUrl: './calculator-param-left.component.html',
	styleUrl: './calculator-param-left.component.scss',
	standalone: true,
	imports: [
		CalculatorParamLeftPresetComponent
	]
})
export class CalculatorParamLeftComponent {
	@Input() formGroup: FormGroup;
}
