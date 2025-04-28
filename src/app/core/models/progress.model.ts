import { WebsocketStatusEnum } from '@core/enums/websocket-status.enum';

export class ProgressModel {
    count: number;
    total: number;
    status: WebsocketStatusEnum;
}
