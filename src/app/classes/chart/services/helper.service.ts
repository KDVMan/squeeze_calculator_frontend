import { LineTypeEnum } from '@core/enums/line-type.enum';

export class HelperService {
	public static getLineType(type: LineTypeEnum): number[] {
		if (type === LineTypeEnum.dash) return [6, 6];
		else if (type === LineTypeEnum.dot) return [1, 2];
		return [];
	}

	public static scaleRange(min: number, max: number, delta: number, center: number | null = null): number[] {
		if (center === null) center = (min + max) / 2;

		return [
			center + (min - center) * delta,
			center + (max - center) * delta
		];
	}
}
