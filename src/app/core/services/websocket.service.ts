import { Injectable } from '@angular/core';
import { filter, Observable, Subject } from 'rxjs';
import { ConfigService } from '@core/services/config.service';
import { map } from 'rxjs/operators';
import { WebsocketModel } from '@core/models/websocket.model';
import { WebsocketEventEnum } from '@core/enums/websocket-event.enum';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    private socket: WebSocket;
    private subject = new Subject<WebsocketModel<any>>();
    public messages$: Observable<WebsocketModel<any>> = this.subject.asObservable();

    constructor(private readonly configService: ConfigService) {
        this.connect();
    }

    private connect(): void {
        this.socket = new WebSocket(this.configService.get('api.ws'));

        this.socket.onmessage = (event) => {
            this.subject.next(JSON.parse(event.data));
        };

        this.socket.onclose = (event) => {
            console.error('Websocket closed', event);
        };

        this.socket.onerror = (error) => {
            console.error('Websocket error', error);
        };
    }

    public receive<T>(event: WebsocketEventEnum): Observable<T> {
        return this.messages$.pipe(
            filter(message => message.event === event),
            map(message => message.data as T)
        );
    }

    public send(data: any): void {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.error('Websocket is not connected.');
        }
    }
}
