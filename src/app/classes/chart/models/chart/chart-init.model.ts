import { InitModel } from '@app/models/init/init.model';
import { QuoteModel } from '@app/models/quote/quote.model';

export class ChartInitModel {
    initModel: InitModel;
    quotes: QuoteModel[];
    timeFrom: number;
    timeTo: number;
    xRescale: boolean;
    yRescale: boolean;
}
