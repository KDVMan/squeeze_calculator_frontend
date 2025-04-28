import { Chart } from '@app/classes/chart/chart';
import { DrawService } from '@app/classes/chart/services/draw.service';
import { TextService } from '@app/classes/chart/services/text.service';

export class CaptionService {
	constructor(private chart: Chart) {
	}

	public drawLineHorizontal(value: number, dashes: number[] | null, thickness: number, color: string): void {
		const y = this.chart.rangeService.y.coordinateBetweenMinMax(value);

		if (dashes) this.chart.context.setLineDash(dashes);

		DrawService.line(
			this.chart.context,
			0,
			y,
			this.chart.getWidth(),
			y,
			thickness,
			color
		);

		if (dashes) this.chart.context.setLineDash([]);
	}

	public drawLineVertical(value: number, dashes: number[] | null, thickness: number, color: string): void {
		const x = this.chart.rangeService.x.coordinateBetweenMinMax(value);

		if (dashes) this.chart.context.setLineDash(dashes);

		DrawService.line(
			this.chart.context,
			x,
			0,
			x,
			this.chart.getHeight(),
			thickness,
			color
		);

		if (dashes) this.chart.context.setLineDash([]);
	}

	public drawBodyRight(value: number, color: string): void {
		DrawService.rectangle(
			this.chart.context,
			this.chart.getWidth(),
			this.chart.rangeService.y.coordinateBetweenMinMax(value) - this.chart.textService.bottomHeight / 2,
			this.chart.textService.rightWidth,
			this.chart.textService.bottomHeight,
			color
		);
	}

	public drawBodyBottom(value: number, color: string): void {
		DrawService.rectangle(
			this.chart.context,
			this.chart.rangeService.x.coordinateBetweenMinMax(value) - this.chart.textService.bottomTextWidth / 2,
			this.chart.getHeight(),
			this.chart.textService.bottomTextWidth,
			this.chart.textService.bottomHeight,
			color
		);
	}

	public drawTextRight(value: number, color: string): void {
		DrawService.text(
			this.chart.context,
			this.chart.textService.formatPrice(value),
			this.chart.getWidth() + this.chart.textService.rightWidth / 2,
			this.chart.rangeService.y.coordinateBetweenMinMax(value) + this.chart.textService.textHeight / 2,
			color
		);
	}

	public drawTextBottom(value: number, color: string): void {
		DrawService.text(
			this.chart.context,
			TextService.formatDate(value),
			this.chart.rangeService.x.coordinateBetweenMinMax(value),
			this.chart.getHeight() + (this.chart.textService.bottomHeight / 2) + (this.chart.textService.textHeight / 2),
			color
		);
	}
}
