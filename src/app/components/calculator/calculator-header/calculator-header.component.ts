import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalculatorHeaderDateComponent } from '@app/components/calculator/calculator-header/calculator-header-date/calculator-header-date.component';
import { CalculatorHeaderCalculateComponent } from '@app/components/calculator/calculator-header/calculator-header-calculate/calculator-header-calculate.component';
import { CalculatorHeaderStartComponent } from '@app/components/calculator/calculator-header/calculator-header-start/calculator-header-start.component';

@Component({
	selector: 'app-calculator-header',
	templateUrl: './calculator-header.component.html',
	styleUrl: './calculator-header.component.scss',
	standalone: true,
	imports: [ReactiveFormsModule, CalculatorHeaderDateComponent, CalculatorHeaderCalculateComponent, CalculatorHeaderStartComponent]
})
export class CalculatorHeaderComponent {
	@Input() formGroup: FormGroup;
}
