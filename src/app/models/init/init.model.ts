import { QuoteIntervalModel } from '@app/models/quote/quote-interval.model';
import { CalculatorFieldEnum } from '@app/enums/calculator/calculator-field.enum';
import { SortDirectionEnum } from '@core/enums/sort-direction.enum';
import { ExecActiveEnum } from '@app/enums/exec/exec-active.enum';

export class InitModel {
    symbol: string;
    intervals: QuoteIntervalModel[];
    quotesLimit: number;
    precision: number;
    calculateSortColumn: CalculatorFieldEnum;
    calculateSortDirection: SortDirectionEnum;
    execActive: ExecActiveEnum;

    public static getActiveInterval(intervals: QuoteIntervalModel[]): QuoteIntervalModel {
        for (let interval of intervals) {
            if (interval.active) return interval;
        }

        return null;
    }
}
