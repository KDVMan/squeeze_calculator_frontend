import { RangeModel } from '@app/classes/chart/models/range/range.model';

export class YModel extends RangeModel {
	coordinateBetweenRange(value: number): number {
		return value * this.size / this.range;
	}

	coordinateBetweenMinMax(value: number): number {
		return this.size - (value - this.min) * this.size / this.range;
	}

	coordinateToValue(value: number): number {
		return this.max - value * this.range / this.size;
	}
}
