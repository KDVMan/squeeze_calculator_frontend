import { Chart } from '@app/classes/chart/chart';
import { QuoteModel } from '@app/models/quote/quote.model';
import { HelperService } from '@app/classes/chart/services/helper.service';

export class CurrentPriceService {
    constructor(private chart: Chart) {
    }

    public draw(): void {
        if (this.chart.timeFrom && this.chart.timeTo && this.chart.quotes[this.chart.quotes.length - 1].timeClose > this.chart.timeTo) return;

        const quote = this.chart.quotes[this.chart.quotes.length - 1];
        const direction = QuoteModel.getDirection(quote.priceOpen, quote.priceClose);
        const y = this.chart.rangeService.y.coordinateBetweenMinMax(quote.priceClose);

        if (y >= 0 && y <= this.chart.getHeight()) {
            if (this.chart.chartSettingsModel.currentPrice.line[direction].active) {
                this.chart.captionService.drawLineHorizontal(
                    quote.priceClose,
                    HelperService.getLineType(this.chart.chartSettingsModel.currentPrice.line[direction].lineType),
                    this.chart.chartSettingsModel.currentPrice.line[direction].thickness,
                    this.chart.chartSettingsModel.currentPrice.line[direction].color
                );
            }

            if (this.chart.chartSettingsModel.currentPrice.body[direction].active) {
                this.chart.captionService.drawBodyRight(
                    quote.priceClose,
                    this.chart.chartSettingsModel.currentPrice.body[direction].color
                );
            }

            if (this.chart.chartSettingsModel.currentPrice.text[direction].active) {
                this.chart.captionService.drawTextRight(
                    quote.priceClose,
                    this.chart.chartSettingsModel.currentPrice.text[direction].color
                );
            }
        }
    }
}
