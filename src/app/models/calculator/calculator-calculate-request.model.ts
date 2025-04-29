import { TradeDirectionEnum } from '@core/enums/trade-direction.enum';
import { IntervalEnum } from '@core/enums/interval.enum';
import { BindEnum } from '@core/enums/bind.enum';
import { AlgorithmEnum } from '@core/enums/algorithm.enum';

export class CalculateCalculateRequestModel {
	id: number;
	symbol: string;
	window: number;
	tradeDirection: TradeDirectionEnum;
	interval: IntervalEnum;
	timeTo: number;
	bind: BindEnum[];
	percentInFrom: number;
	percentInTo: number;
	percentInStep: number;
	percentOutFrom: number;
	percentOutTo: number;
	percentOutStep: number;
	stopTime: boolean;
	stopTimeFrom: number;
	stopTimeTo: number;
	stopTimeStep: number;
	stopPercent: boolean;
	stopPercentFrom: number;
	stopPercentTo: number;
	stopPercentStep: number;
	algorithm: AlgorithmEnum;
	iterations: number;
}
