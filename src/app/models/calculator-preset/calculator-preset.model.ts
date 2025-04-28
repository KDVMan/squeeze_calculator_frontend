import { IntervalEnum } from '@core/enums/interval.enum';
import { BindEnum } from '@core/enums/bind.enum';
import { AlgorithmEnum } from '@core/enums/algorithm.enum';
import { TradeDirectionEnum } from '@core/enums/trade-direction.enum';

export class CalculatorPresetModel {
    id: number;
    name: string;
    window: number;
    tradeDirection: TradeDirectionEnum;
    interval: IntervalEnum;
    timeFrom: number;
    timeTo: number;
    bind: BindEnum[];
    percentInFrom: number;
    percentInTo: number;
    percentInStep: number;
    percentOutFrom: number;
    percentOutTo: number;
    percentOutStep: number;
    stopTime: boolean;
    stopTimeFrom: number;
    stopTimeTo: number;
    stopTimeStep: number;
    stopPercent: boolean;
    stopPercentFrom: number;
    stopPercentTo: number;
    stopPercentStep: number;
    algorithm: AlgorithmEnum;
    iterations: number;
    selected: boolean;
}
