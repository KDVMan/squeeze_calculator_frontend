import { QuoteModel } from '@app/models/quote/quote.model';
import { CalculateDealModel } from '@app/models/calculate/calculate-deal.model';

export interface QuoteResponseModel {
    quotes: QuoteModel[];
    timeFrom: number;
    timeTo: number;
    deals: CalculateDealModel[];
}
