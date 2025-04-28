import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorFormulaRightFilterComponent } from '@app/components/calculator/calculator-formula-right/calculator-formula-right-filter/calculator-formula-right-filter.component';
import { CalculatorFormulaRightFormulaComponent } from '@app/components/calculator/calculator-formula-right/calculator-formula-right-formula/calculator-formula-right-formula.component';

@Component({
    selector: 'app-calculator-formula-right',
    templateUrl: './calculator-formula-right.component.html',
    styleUrl: './calculator-formula-right.component.scss',
    standalone: true,
    imports: [CommonModule, CalculatorFormulaRightFilterComponent, CalculatorFormulaRightFormulaComponent]
})
export class CalculatorTemplateComponent {
}
