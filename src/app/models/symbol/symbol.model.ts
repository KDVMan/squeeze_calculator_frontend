import { SymbolStatisticModel } from '@app/models/symbol/symbol-statistic.model';

export interface SymbolModel {
    group: string;
    symbol: string;
    precision: number;
    statistic: SymbolStatisticModel;
}
