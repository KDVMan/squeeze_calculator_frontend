import { Chart } from '@app/classes/chart/chart';
import { QuoteModel } from '@app/models/quote/quote.model';
import { DrawService } from '@app/classes/chart/services/draw.service';
import { DrawTypeEnum } from '@app/classes/chart/enums/draw-type.enum';
import { DirectionEnum } from '@core/enums/direction.enum';

export class CandleService {
    constructor(private chart: Chart) {
    }

    public draw(): void {
        const calculate = this.calculate();
        if (calculate.firstIndex < this.chart.initModel.quotesLimit) this.chart.loadQuoteService.load();

        const visibleQuotes = this.chart.quotes.slice(calculate.firstIndex, calculate.lastIndex);
        this.chart.rangeService.volume.updateMinMax(visibleQuotes);

        visibleQuotes.forEach((quote: QuoteModel) => {
            const x = this.chart.rangeService.x.coordinateBetweenMinMax(quote.timeOpen);
            const direction = QuoteModel.getDirection(quote.priceOpen, quote.priceClose);

            if (this.chart.chartSettingsModel.volume.body[direction].active) {
                this.drawVolume(quote, x, direction, DrawTypeEnum.body);
            }

            if (this.chart.chartSettingsModel.volume.border[direction].active) {
                this.drawVolume(quote, x, direction, DrawTypeEnum.border);
            }

            if (this.chart.chartSettingsModel.candle.stick[direction].active) {
                this.drawStick(quote, x, direction);
            }

            if (this.chart.chartSettingsModel.candle.body[direction].active && this.chart.candleWidth >= this.chart.chartSettingsModel.candle.body[direction].minWidth) {
                this.drawCandle(quote, x, direction, DrawTypeEnum.body);
            }

            if (this.chart.chartSettingsModel.candle.border[direction].active && this.chart.candleWidth >= this.chart.chartSettingsModel.candle.border[direction].minWidth) {
                this.drawCandle(quote, x, direction, DrawTypeEnum.border);
            }

            if (this.chart.candleWidth > 1 && this.chart.mouseService.x >= x - this.chart.candleWidthHalf && this.chart.mouseService.x <= x + this.chart.candleWidthHalf) {
                this.chart.mouseService.x = x;
                if (this.chart.rulerService.allow && !this.chart.rulerService.fixed) this.chart.rulerService.xEnd = x;
            }
        });
    }

    private drawVolume(quote: QuoteModel, x: number, direction: DirectionEnum, type: DrawTypeEnum): void {
        const minLevelPercent = this.chart.chartSettingsModel.volume.minLevelPercent / 100;
        const maxLevelPercent = this.chart.chartSettingsModel.volume.maxLevelPercent / 100;
        const height = this.chart.getHeight();
        let delta = this.chart.getHeight() / this.chart.rangeService.volume.range * minLevelPercent;
        const check = this.chart.rangeService.volume.max * delta / this.chart.getHeight();

        if (check <= minLevelPercent) {
            delta *= minLevelPercent * height / (this.chart.rangeService.volume.max * delta);
        } else if (check >= maxLevelPercent) {
            delta *= maxLevelPercent * height / (this.chart.rangeService.volume.max * delta);
        }

        const y = delta * quote.volumeRight;

        if (type === DrawTypeEnum.border) {
            DrawService.rectangleBorder(
                this.chart.context,
                x - this.chart.candleWidthHalf,
                this.chart.getHeight() - y,
                this.chart.candleWidth,
                y,
                this.chart.chartSettingsModel.volume.border[direction].thickness,
                this.chart.chartSettingsModel.volume.border[direction].color,
                true
            );
        } else if (type === DrawTypeEnum.body) {
            DrawService.rectangle(
                this.chart.context,
                x - this.chart.candleWidthHalf,
                this.chart.getHeight() - y,
                this.chart.candleWidth,
                y,
                this.chart.chartSettingsModel.volume.body[direction].color
            );
        }
    }

    private drawStick(quote: QuoteModel, x: number, direction: DirectionEnum): void {
        DrawService.line(
            this.chart.context,
            x,
            this.chart.rangeService.y.coordinateBetweenMinMax(quote.priceLow),
            x,
            this.chart.rangeService.y.coordinateBetweenMinMax(quote.priceHigh),
            this.chart.chartSettingsModel.candle.stick[direction].thickness,
            this.chart.chartSettingsModel.candle.stick[direction].color
        );
    }

    private drawCandle(quote: QuoteModel, x: number, direction: DirectionEnum, type: DrawTypeEnum): void {
        const xStart = x - this.chart.candleWidthHalf;
        const yStart = this.chart.rangeService.y.coordinateBetweenMinMax(Math.min(quote.priceOpen, quote.priceClose));
        const yEnd = this.chart.rangeService.y.coordinateBetweenMinMax(Math.max(quote.priceOpen, quote.priceClose));
        let height = yEnd - yStart;
        if (height > -2 && height < 2) height = 2;

        if (type === DrawTypeEnum.border) {
            DrawService.rectangleBorder(
                this.chart.context,
                xStart,
                yStart,
                this.chart.candleWidth,
                height,
                this.chart.chartSettingsModel.candle.border[direction].thickness,
                this.chart.chartSettingsModel.candle.border[direction].color
            );
        } else if (type === DrawTypeEnum.body) {
            DrawService.rectangle(
                this.chart.context,
                xStart,
                yStart,
                this.chart.candleWidth,
                height,
                this.chart.chartSettingsModel.candle.body[direction].color
            );
        }
    }

    private calculate(): { firstIndex: number, lastIndex: number } {
        const result = {
            firstIndex: -1,
            lastIndex: -1
        };

        this.chart.candleWidth = this.chart.rangeService.x.coordinateBetweenRange(this.chart.rangeService.x.delta) - this.chart.chartSettingsModel.candle.gapSize;
        if (this.chart.candleWidth < 1) this.chart.candleWidth = 1;

        this.chart.candleWidthHalf = this.chart.candleWidth / 2;

        for (let i = 0; i < this.chart.quotes.length; i++) {
            const x = this.chart.rangeService.x.coordinateBetweenMinMax(this.chart.quotes[i].timeOpen);

            if (result.firstIndex === -1 && x + this.chart.candleWidthHalf >= 0) {
                result.firstIndex = i;
            }

            if (result.firstIndex !== -1 && x > this.chart.getWidth() + this.chart.candleWidthHalf) {
                result.lastIndex = i;
                break;
            }
        }

        if (result.lastIndex === -1) result.lastIndex = this.chart.quotes.length;

        return result;
    }
}
