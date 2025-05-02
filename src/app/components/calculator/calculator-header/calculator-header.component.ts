import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalculatorHeaderDateComponent } from '@app/components/calculator/calculator-header/calculator-header-date/calculator-header-date.component';
import { CalculatorHeaderCalculateComponent } from '@app/components/calculator/calculator-header/calculator-header-calculate/calculator-header-calculate.component';
import { CalculatorHeaderStartComponent } from '@app/components/calculator/calculator-header/calculator-header-start/calculator-header-start.component';
import { CalculatorHeaderUpdateComponent } from '@app/components/calculator/calculator-header/calculator-header-update/calculator-header-update.component';
import { CalculatorHeaderStartMassComponent } from '@app/components/calculator/calculator-header/calculator-header-start-mass/calculator-header-start-mass.component';

@Component({
	selector: 'app-calculator-header',
	templateUrl: './calculator-header.component.html',
	styleUrl: './calculator-header.component.scss',
	standalone: true,
	imports: [ReactiveFormsModule, CalculatorHeaderDateComponent, CalculatorHeaderCalculateComponent, CalculatorHeaderStartComponent, CalculatorHeaderUpdateComponent, CalculatorHeaderStartMassComponent]
})
export class CalculatorHeaderComponent {
	@Input() formGroup: FormGroup;
}
