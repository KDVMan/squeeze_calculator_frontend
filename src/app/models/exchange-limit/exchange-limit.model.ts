import { ExchangeRateTypeEnum } from '@app/enums/exchange-limit/exchange-rate-type.enum';
import { ExchangeRateIntervalEnum } from '@app/enums/exchange-limit/exchange-rate-interval.enum';

export class ExchangeLimitModel {
    type: ExchangeRateTypeEnum;
    interval: ExchangeRateIntervalEnum;
    intervalNumber: number;
    total: number;
    totalLeft: number;
}
