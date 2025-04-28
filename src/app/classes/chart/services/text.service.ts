import { Chart } from '@app/classes/chart/chart';

export class TextService {
    public fontHeight: number;
    public textHeight: number;
    public rightTextWidth: number;
    public rightWidth: number;
    public bottomTextWidth: number;
    // public bottomWidth: number;
    public bottomHeight: number;
    public captionCurrentPriceSize: number;
    public captionAimRightSize: number;
    public captionAimBottomSize: number;

    constructor(private chart: Chart) {
        this.reset();
    }

    public static formatPrecision(context: CanvasRenderingContext2D, value: number, precision: number): number {
        const result = parseFloat(value.toString()).toFixed(precision);

        return Math.round(context.measureText(result).width);
    }

    public static formatDate(unixTime: number): string {
        const date = new Date(unixTime);
        const day = `${date.getDate()}`.padStart(2, '0');
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const hour = `${date.getHours()}`.padStart(2, '0');
        const minutes = `${date.getMinutes()}`.padStart(2, '0');
        const seconds = `${date.getSeconds()}`.padStart(2, '0');

        return `${day}.${month}.${date.getFullYear()} ${hour}:${minutes}:${seconds}`;
    }

    public formatPrice(value: number): string {
        const pixel = this.chart.rangeService.y.range / this.chart.getHeight();
        let factor = 1;

        while (factor <= this.chart.rangeService.y.max) {
            factor *= 10;
        }

        while (factor > pixel && factor > 1) {
            factor /= 10;
        }

        const precisionFactor = Math.pow(10, this.chart.initModel.precision);
        const roundedValue = Math.round(value / factor * precisionFactor) * factor / precisionFactor;

        return roundedValue.toFixed(this.chart.initModel.precision);
    }

    public formatNumber(value: number, precision: number = 8, useSpace: boolean = true): string {
        let formattedValue = value.toFixed(precision);

        if (precision === 0) {
            formattedValue = formattedValue.split('.')[0];
        } else {
            formattedValue = formattedValue.replace(/(?:\.0*|(\.\d+?)0+)$/, '$1');
        }

        if (formattedValue === '' || formattedValue === '-') {
            formattedValue = '0';
        }

        const separator = useSpace ? ' ' : '';

        if (formattedValue.includes('.')) {
            const parts = formattedValue.split('.');
            formattedValue = parseInt(parts[0]).toLocaleString('en').replace(/,/g, separator) + '.' + parts[1];
        } else {
            formattedValue = parseInt(formattedValue).toLocaleString('en').replace(/,/g, separator);
        }

        return formattedValue;
    }

    public getTextMetrics(text: string): TextMetrics {
        return this.chart.context.measureText(text);
    }

    public getTextSize(text: string): { width: number, height: number } {
        const metrics = this.getTextMetrics(text);

        return {
            width: metrics.width,
            height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
        };
    }

    public reset(): void {
        const metrics = this.getTextMetrics('99.99.9999 99:99:99');

        this.fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        this.textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        this.rightTextWidth = TextService.formatPrecision(this.chart.context, this.chart.quotes[this.chart.quotes.length - 1].priceHigh, this.chart.initModel.precision);
        this.rightWidth = this.rightTextWidth + this.chart.chartSettingsModel.legend.horizontal.horizontalPadding;

        this.bottomTextWidth = Math.round(metrics.width) + this.chart.chartSettingsModel.legend.vertical.horizontalPadding;
        // this.bottomWidth = this.bottomTextWidth + this.chart.chartSettingsModel.legend.bottom.horizontalPadding;
        this.bottomHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + this.chart.chartSettingsModel.legend.vertical.verticalPadding;

        // this.captionCurrentPriceSize = this.fontHeight + this.chart.settings.currentPrice.text.padding;

        // this.captionAimRightSize = this.fontHeight + this.chart.settings.aim.text.right.verticalPadding;
        // this.captionAimBottomSize = this.fontHeight + this.chart.settings.aim.text.bottom.horizontalPadding;
    }
}
