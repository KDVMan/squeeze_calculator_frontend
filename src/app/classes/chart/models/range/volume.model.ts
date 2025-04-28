import { RangeModel } from '@app/classes/chart/models/range/range.model';
import { QuoteModel } from '@app/models/quote/quote.model';

export class VolumeModel extends RangeModel {
	updateMinMax(quotes: QuoteModel[]): void {
		this.min = Number.MAX_VALUE;
		this.max = Number.MIN_VALUE;

		if (quotes.length === 0) return;

		quotes.forEach((quote: QuoteModel) => {
			this.min = Math.min(this.min, quote.volumeRight);
			this.max = Math.max(this.max, quote.volumeRight);
		});
	}
}
