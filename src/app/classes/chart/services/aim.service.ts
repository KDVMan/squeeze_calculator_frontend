import { Chart } from '@app/classes/chart/chart';
import { HelperService } from '@app/classes/chart/services/helper.service';

export class AimService {
    constructor(private chart: Chart) {
    }

    public draw(): void {
        if (this.chart.mouseService.x >= 0 && this.chart.mouseService.x <= this.chart.getWidth()) this.drawVertical();
        if (this.chart.mouseService.y >= 0 && this.chart.mouseService.y <= this.chart.getHeight()) this.drawHorizontal();
    }

    private drawVertical(): void {
        const value = this.chart.rangeService.x.coordinateToValue(this.chart.mouseService.x);

        if (this.chart.chartSettingsModel.aim.line.vertical.active) {
            this.chart.captionService.drawLineVertical(
                value,
                HelperService.getLineType(this.chart.chartSettingsModel.aim.line.vertical.lineType),
                this.chart.chartSettingsModel.aim.line.vertical.thickness,
                this.chart.chartSettingsModel.aim.line.vertical.color
            );
        }

        if (this.chart.chartSettingsModel.aim.body.vertical.active) {
            this.chart.captionService.drawBodyBottom(
                value,
                this.chart.chartSettingsModel.aim.body.vertical.color
            );
        }

        if (this.chart.chartSettingsModel.aim.text.vertical.active) {
            this.chart.captionService.drawTextBottom(
                value,
                this.chart.chartSettingsModel.aim.text.vertical.color
            );
        }
    }

    private drawHorizontal(): void {
        const value = this.chart.rangeService.y.coordinateToValue(this.chart.mouseService.y);

        if (this.chart.chartSettingsModel.aim.line.horizontal.active) {
            this.chart.captionService.drawLineHorizontal(
                value,
                HelperService.getLineType(this.chart.chartSettingsModel.aim.line.horizontal.lineType),
                this.chart.chartSettingsModel.aim.line.horizontal.thickness,
                this.chart.chartSettingsModel.aim.line.horizontal.color
            );
        }

        if (this.chart.chartSettingsModel.aim.body.horizontal.active) {
            this.chart.captionService.drawBodyRight(
                value,
                this.chart.chartSettingsModel.aim.body.horizontal.color
            );
        }

        if (this.chart.chartSettingsModel.aim.text.horizontal.active) {
            this.chart.captionService.drawTextRight(
                value,
                this.chart.chartSettingsModel.aim.text.horizontal.color
            );
        }
    }
}
