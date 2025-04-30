import { BotStatusEnum } from '@app/enums/bot/bot-status.enum';

export class BotUpdateStatusRequestModel {
	id: number;
	status: BotStatusEnum;
}
