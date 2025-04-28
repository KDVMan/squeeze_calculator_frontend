import { DrawService } from '@app/classes/chart/services/draw.service';
import { TextService } from '@app/classes/chart/services/text.service';
import { Chart } from '@app/classes/chart/chart';

export class LegendService {
    constructor(private chart: Chart) {
    }

    public draw(): void {
        this.chart.context.textAlign = 'center';

        DrawService.rectangle(
            this.chart.context,
            this.chart.getWidth(),
            0,
            this.chart.textService.rightWidth,
            this.chart.getHeight(),
            this.chart.chartSettingsModel.legend.horizontal.background
        );

        this.chart.gridService.getVertical().forEach(value => {
            this.drawLegendHorizontal(value);
        });

        DrawService.rectangle(
            this.chart.context,
            0,
            this.chart.getHeight(),
            this.chart.getWidth(true),
            this.chart.textService.bottomHeight,
            this.chart.chartSettingsModel.legend.vertical.background
        );

        this.chart.gridService.getHorizontal().forEach(value => {
            this.drawLegendVertical(value);
        });
    }

    private drawLegendHorizontal(value: number): void {
        const y = this.chart.rangeService.y.coordinateBetweenMinMax(value);

        DrawService.text(
            this.chart.context,
            this.chart.textService.formatPrice(value),
            this.chart.getWidth() + this.chart.textService.rightWidth / 2,
            y + this.chart.textService.textHeight / 2,
            this.chart.chartSettingsModel.legend.horizontal.color
        );
    }

    private drawLegendVertical(value: number): void {
        DrawService.text(
            this.chart.context,
            TextService.formatDate(value),
            this.chart.rangeService.x.coordinateBetweenMinMax(value),
            this.chart.getHeight() + (this.chart.textService.bottomHeight / 2) + (this.chart.textService.textHeight / 2),
            this.chart.chartSettingsModel.legend.vertical.color
        );
    }
}
