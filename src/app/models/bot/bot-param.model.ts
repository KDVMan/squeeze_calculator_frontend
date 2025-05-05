import { BindEnum } from '@core/enums/bind.enum';

export class BotParamModel {
	bind: BindEnum;
	percentIn: number;
	percentOut: number;
	stopTime: number;
	stopPercent: number;
	score: number;
	lastUpdate: number;
	secondsSinceLastUpdate: number = 0;

	updateTimer(): void {
		if (!this.lastUpdate) {
			this.secondsSinceLastUpdate = 0;
		} else {
			this.secondsSinceLastUpdate = Math.floor((Date.now() - this.lastUpdate) / 1000);
		}
	}
}
