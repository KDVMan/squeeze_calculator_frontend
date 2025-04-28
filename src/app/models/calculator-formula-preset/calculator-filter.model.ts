import { CalculatorFilterEnum } from '@app/enums/calculator-formula-preset/calculator-filter.enum';

export class CalculatorFilterModel {
    name: string;
    filter?: CalculatorFilterEnum;
    value: number;
}
