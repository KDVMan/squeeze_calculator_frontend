import { HelperService } from '@app/classes/chart/services/helper.service';

export class RangeModel {
	size: number = 0;
	min: number = Number.MAX_VALUE;
	max: number = Number.MIN_VALUE;
	range: number = 0;
	delta: number = 0;

	constructor(size: number = 0) {
		this.size = size;
	}

	scale(delta: number, center: number | null = null): void {
		[this.min, this.max] = HelperService.scaleRange(this.min, this.max, delta, center);
		this.range = this.max - this.min;
	}

	updateRange(): void {
		this.range = this.max - this.min;
	}
}
