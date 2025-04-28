import { Chart } from '@app/classes/chart/chart';
import { HelperService } from '@app/classes/chart/services/helper.service';
import { DrawService } from '@app/classes/chart/services/draw.service';

export class GridService {
    public readonly second: number = 1000;

    constructor(private chart: Chart) {
    }

    public draw(): void {
        if (this.chart.chartSettingsModel.grid.vertical.active) {
            this.chart.context.setLineDash(HelperService.getLineType(this.chart.chartSettingsModel.grid.vertical.lineType));

            this.getHorizontal().forEach(value => {
                const x = this.chart.rangeService.x.coordinateBetweenMinMax(value);

                DrawService.line(
                    this.chart.context,
                    x,
                    0,
                    x,
                    this.chart.getHeight(),
                    this.chart.chartSettingsModel.grid.vertical.thickness,
                    this.chart.chartSettingsModel.grid.vertical.color
                );
            });

            this.chart.context.setLineDash([]);
        }

        if (this.chart.chartSettingsModel.grid.horizontal.active) {
            this.chart.context.setLineDash(HelperService.getLineType(this.chart.chartSettingsModel.grid.horizontal.lineType));

            this.getVertical().forEach(value => {
                const y = this.chart.rangeService.y.coordinateBetweenMinMax(value);

                DrawService.line(
                    this.chart.context,
                    0,
                    y,
                    this.chart.getWidth(),
                    y,
                    this.chart.chartSettingsModel.grid.horizontal.thickness,
                    this.chart.chartSettingsModel.grid.horizontal.color
                );
            });

            this.chart.context.setLineDash([]);
        }
    }

    public getHorizontal(): number[] {
        const delta = this.deltaTimes().find(x => this.chart.rangeService.x.coordinateBetweenRange(x) > this.chart.textService.bottomTextWidth) || 0;
        const xMin = this.chart.rangeService.x.min;
        const xMax = this.chart.rangeService.x.max;
        const tickStart = xMin - xMin % delta - 2 * delta;
        const result = [];

        for (let tick = tickStart; tick <= xMax + 2 * delta; tick += delta) {
            if (tick >= xMin && tick <= xMax) result.push(tick);
        }

        return result;
    }

    public getVertical(gridDensity: number = 20, scaleStep: number = 0.1): number[] {
        const result = [];
        if (this.chart.rangeService.y.range === 0) return result;

        const yMin = this.chart.rangeService.y.min;
        const yMax = this.chart.rangeService.y.max;

        let factor = Math.pow(10, Math.floor(Math.log10(this.chart.rangeService.y.range)));
        let scaleFactor = 0;
        let count = 0;

        while (this.chart.rangeService.y.coordinateBetweenRange(factor * scaleFactor) < this.chart.getHeight() / gridDensity) {
            count++;
            scaleFactor += scaleStep;
        }

        factor *= scaleFactor;
        let tick = yMin - yMin % factor;

        do {
            if (tick >= yMin && tick <= yMax) result.push(tick);
            tick += factor;
        } while (tick <= yMax + factor);

        return result;
    }

    public deltaTimes(): number[] {
        const minute: number = 60 * this.second;
        const hour: number = 60 * minute;
        const day: number = 24 * hour;
        const week: number = 7 * day;
        const month: number = 30 * day;
        const year: number = 12 * month;

        return [
            minute,
            minute * 30,
            hour,
            hour * 3,
            day,
            day * 3,
            week,
            week * 2,
            month,
            month * 3,
            month * 6,
            year,
            year * 2,
            year * 5,
            year * 10
        ];
    }
}
