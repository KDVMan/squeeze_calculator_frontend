import { TradeDirectionEnum } from '@core/enums/trade-direction.enum';
import { IntervalEnum } from '@core/enums/interval.enum';
import { BindEnum } from '@core/enums/bind.enum';

export class CalculateParamModel {
    symbol: string;
    tradeDirection: TradeDirectionEnum;
    interval: IntervalEnum;
    bind: BindEnum;
    percentIn: number;
    percentOut: number;
    stopTime: number;
    stopPercent: number;
}
