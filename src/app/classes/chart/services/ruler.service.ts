import { Chart } from '@app/classes/chart/chart';
import { DirectionEnum } from '@core/enums/direction.enum';
import { DrawService } from '@app/classes/chart/services/draw.service';
import { HelperService } from '@app/classes/chart/services/helper.service';

export class RulerService {
    public xStart: number = 0;
    public xEnd: number = 0;
    public yStart: number = 0;
    public yEnd: number = 0;
    public allow: boolean = false;
    public fixed: boolean = false;

    constructor(private chart: Chart) {
    }

    public draw(): void {
        const direction = this.yStart > this.yEnd ? DirectionEnum.up : DirectionEnum.down;

        const x1 = Math.min(this.xStart, this.xEnd);
        const x2 = Math.max(this.xStart, this.xEnd);
        const y1 = Math.min(this.yStart, this.yEnd);
        const y2 = Math.max(this.yStart, this.yEnd);

        if (this.chart.chartSettingsModel.ruler.body[direction].active) this.drawBody(x1, x2, y1, y2, direction);
        this.drawInformation(x1, x2, y1, y2, direction);
        if (this.chart.chartSettingsModel.ruler.arrow[direction].active) this.drawArrow(x1, x2, y1, y2, direction);
        this.drawCaption(x1, x2, y1, y2, direction);
    }

    private drawBody(x1: number, x2: number, y1: number, y2: number, direction: DirectionEnum): void {
        DrawService.rectangle(
            this.chart.context,
            x1,
            y1,
            x2 - x1,
            y2 - y1,
            this.chart.chartSettingsModel.ruler.body[direction].color
        );
    }

    private drawInformation(x1: number, x2: number, y1: number, y2: number, direction: DirectionEnum): void {
        const delta = this.getDelta();
        const information = `${this.chart.textService.formatPrice(delta.delta)} (${delta.percent.toFixed(2)}%)`;
        const width = this.chart.textService.getTextMetrics(information).width + this.chart.chartSettingsModel.ruler.information.horizontalPadding;
        const height = this.chart.textService.textHeight + this.chart.chartSettingsModel.ruler.information.verticalPadding;
        const x = Math.min(Math.max((x1 + x2 - width) / 2, 0), this.chart.getWidth() - width);
        let y = Math.min(y2 + this.chart.chartSettingsModel.ruler.information.indent, this.chart.getHeight() - height);

        if (this.yStart > this.yEnd) {
            y = y1 - height - this.chart.chartSettingsModel.ruler.information.indent;
            if (y <= 0) y = 0;
        }

        if (this.chart.chartSettingsModel.ruler.information.body[direction].active) {
            DrawService.rectangle(this.chart.context, x, y, width, height, this.chart.chartSettingsModel.ruler.information.body[direction].color);
        }

        if (this.chart.chartSettingsModel.ruler.information.text[direction].active) {
            DrawService.text(this.chart.context, information, x + width / 2, y + height / 2 + this.chart.textService.textHeight / 2, this.chart.chartSettingsModel.ruler.information.text[direction].color);
        }
    }

    private drawArrow(x1: number, x2: number, y1: number, y2: number, direction: DirectionEnum): void {
        const tip = 6;

        this.chart.context.strokeStyle = this.chart.chartSettingsModel.ruler.arrow[direction].color;
        this.chart.context.setLineDash([]);
        this.chart.context.beginPath();
        this.chart.context.moveTo(x1, (y1 + y2) / 2);
        this.chart.context.lineTo(x2, (y1 + y2) / 2);
        this.chart.context.moveTo((x1 + x2) / 2, y1);
        this.chart.context.lineTo((x1 + x2) / 2, y2);

        if (x2 - x1 >= tip) {
            if (this.xStart < this.xEnd) {
                this.chart.context.moveTo(x2 - tip, (y1 + y2) / 2 - tip);
                this.chart.context.lineTo(x2, (y1 + y2) / 2);
                this.chart.context.lineTo(x2 - tip, (y1 + y2) / 2 + tip);
            } else {
                this.chart.context.moveTo(x1 + tip, (y1 + y2) / 2 - tip);
                this.chart.context.lineTo(x1, (y1 + y2) / 2);
                this.chart.context.lineTo(x1 + tip, (y1 + y2) / 2 + tip);
            }
        }

        if (y2 - y1 >= tip) {
            if (this.yStart < this.yEnd) {
                this.chart.context.moveTo((x1 + x2) / 2 + tip, y2 - tip);
                this.chart.context.lineTo((x1 + x2) / 2, y2);
                this.chart.context.lineTo((x1 + x2) / 2 - tip, y2 - tip);
            } else {
                this.chart.context.moveTo((x1 + x2) / 2 + tip, y1 + tip);
                this.chart.context.lineTo((x1 + x2) / 2, y1);
                this.chart.context.lineTo((x1 + x2) / 2 - tip, y1 + tip);
            }
        }

        this.chart.context.stroke();
    }

    private drawCaption(x1: number, x2: number, y1: number, y2: number, direction: DirectionEnum): void {
        x1 = this.chart.rangeService.x.coordinateToValue(x1);
        x2 = this.chart.rangeService.x.coordinateToValue(x2);
        y1 = this.chart.rangeService.y.coordinateToValue(y1);
        y2 = this.chart.rangeService.y.coordinateToValue(y2);

        if (this.chart.chartSettingsModel.ruler.caption.line[direction].horizontal.active) {
            this.chart.captionService.drawLineHorizontal(
                y1,
                HelperService.getLineType(this.chart.chartSettingsModel.ruler.caption.line[direction].horizontal.lineType),
                this.chart.chartSettingsModel.ruler.caption.line[direction].horizontal.thickness,
                this.chart.chartSettingsModel.ruler.caption.line[direction].horizontal.color
            );

            this.chart.captionService.drawLineHorizontal(
                y2,
                HelperService.getLineType(this.chart.chartSettingsModel.ruler.caption.line[direction].horizontal.lineType),
                this.chart.chartSettingsModel.ruler.caption.line[direction].horizontal.thickness,
                this.chart.chartSettingsModel.ruler.caption.line[direction].horizontal.color
            );
        }

        if (this.chart.chartSettingsModel.ruler.caption.line[direction].vertical.active) {
            this.chart.captionService.drawLineVertical(
                x1,
                HelperService.getLineType(this.chart.chartSettingsModel.ruler.caption.line[direction].vertical.lineType),
                this.chart.chartSettingsModel.ruler.caption.line[direction].vertical.thickness,
                this.chart.chartSettingsModel.ruler.caption.line[direction].vertical.color
            );

            this.chart.captionService.drawLineVertical(
                x2,
                HelperService.getLineType(this.chart.chartSettingsModel.ruler.caption.line[direction].vertical.lineType),
                this.chart.chartSettingsModel.ruler.caption.line[direction].vertical.thickness,
                this.chart.chartSettingsModel.ruler.caption.line[direction].vertical.color
            );
        }

        if (this.chart.chartSettingsModel.ruler.caption.body[direction].right.active) {
            this.chart.captionService.drawBodyRight(
                y1,
                this.chart.chartSettingsModel.ruler.caption.body[direction].right.color
            );

            this.chart.captionService.drawBodyRight(
                y2,
                this.chart.chartSettingsModel.ruler.caption.body[direction].right.color
            );
        }

        if (this.chart.chartSettingsModel.ruler.caption.body[direction].bottom.active) {
            this.chart.captionService.drawBodyBottom(
                x1,
                this.chart.chartSettingsModel.ruler.caption.body[direction].bottom.color
            );

            this.chart.captionService.drawBodyBottom(
                x2,
                this.chart.chartSettingsModel.ruler.caption.body[direction].bottom.color
            );
        }

        if (this.chart.chartSettingsModel.ruler.caption.text[direction].right.active) {
            this.chart.captionService.drawTextRight(
                y1,
                this.chart.chartSettingsModel.ruler.caption.text[direction].right.color
            );

            this.chart.captionService.drawTextRight(
                y2,
                this.chart.chartSettingsModel.ruler.caption.text[direction].right.color
            );
        }

        if (this.chart.chartSettingsModel.ruler.caption.text[direction].bottom.active) {
            this.chart.captionService.drawTextBottom(
                x1,
                this.chart.chartSettingsModel.ruler.caption.text[direction].bottom.color
            );

            this.chart.captionService.drawTextBottom(
                x2,
                this.chart.chartSettingsModel.ruler.caption.text[direction].bottom.color
            );
        }
    }

    public rescaleX(delta: number): void {
        const range = HelperService.scaleRange(
            this.chart.rangeService.x.coordinateToValue(this.xStart),
            this.chart.rangeService.x.coordinateToValue(this.xEnd),
            1 / delta,
            (this.chart.rangeService.x.min + this.chart.rangeService.x.max) / 2
        );

        this.xStart = this.chart.rangeService.x.coordinateBetweenMinMax(range[0]);
        this.xEnd = this.chart.rangeService.x.coordinateBetweenMinMax(range[1]);
    }

    public rescaleY(delta: number): void {
        const range = HelperService.scaleRange(
            this.chart.rangeService.y.coordinateToValue(this.yStart),
            this.chart.rangeService.y.coordinateToValue(this.yEnd),
            1 / delta,
            (this.chart.rangeService.y.min + this.chart.rangeService.y.max) / 2
        );

        this.yStart = this.chart.rangeService.y.coordinateBetweenMinMax(range[0]);
        this.yEnd = this.chart.rangeService.y.coordinateBetweenMinMax(range[1]);
    }

    private getDelta(): { delta: number, percent: number } {
        const yStart = this.chart.rangeService.y.coordinateToValue(this.yStart);
        const yEnd = this.chart.rangeService.y.coordinateToValue(this.yEnd);
        const delta = yEnd - yStart;
        const percent = delta * 100 / yStart;

        return {
            delta: delta,
            percent: percent
        };
    }
}
