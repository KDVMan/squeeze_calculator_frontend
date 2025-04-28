import { CalculatorFormulaModel } from '@app/models/calculator-formula-preset/calculator-formula.model';
import { CalculatorFilterModel } from '@app/models/calculator-formula-preset/calculator-filter.model';

export class CalculatorFormulaPresetModel {
    id: number;
    name: string;
    filters: CalculatorFilterModel[];
    formulas: CalculatorFormulaModel[];
    selected: boolean;
}
