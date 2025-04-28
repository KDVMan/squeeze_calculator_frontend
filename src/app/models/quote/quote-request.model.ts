import { QuoteTypeEnum } from '@app/enums/quote/quote-type.enum';

export interface QuoteRequestModel {
    symbol: string;
    interval: string;
    quotesLimit: number;
    timeEnd: number;
    index: number; // для calculate
    type: QuoteTypeEnum;
}
