import { WebsocketEventEnum } from '@core/enums/websocket-event.enum';

export interface WebsocketModel<T> {
    event: WebsocketEventEnum;
    data: T;
}
