import { CalculateParamModel } from '@app/models/calculate/calculate-param.model';
import { CalculateDealModel } from '@app/models/calculate/calculate-deal.model';

export class CalculateModel {
    total: number;
    totalStops: number;
    totalStopsMinus: number;
    totalStopsPlus: number;
    totalTakes: number;
    totalTakesPlus: number;
    totalProfitPercent: number;
    totalCumulativeProfitPercent: number;
    maxDrawdownPercent: number;
    maxTimeDeal: number;
    inOutRatio: number;
    coefficient: number;
    coefficientPlus: number;
    winRate: number;
    winRatePlus: number;
    score: number;
    param: CalculateParamModel;
    deals: CalculateDealModel[];
}
