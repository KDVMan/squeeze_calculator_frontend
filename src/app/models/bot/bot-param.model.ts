import { BindEnum } from '@core/enums/bind.enum';

export class BotParamModel {
	bind: BindEnum;
	percentIn: number;
	percentOut: number;
	stopTime: number;
	stopPercent: number;
}
