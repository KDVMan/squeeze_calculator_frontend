import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { WebsocketService } from '@core/services/websocket.service';
import { WebsocketEventEnum } from '@core/enums/websocket-event.enum';
import { ExchangeLimitModel } from '@app/models/exchange-limit/exchange-limit.model';

@Component({
    selector: 'app-footer-limit',
    templateUrl: './footer-limit.component.html',
    styleUrl: './footer-limit.component.scss',
    standalone: true,
    imports: [CommonModule, TranslateModule]
})
export class FooterLimitComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    public limits: { key: string; total: number; totalLeft: number }[] = [];

    constructor(private readonly websocketService: WebsocketService) {
    }

    public ngOnInit(): void {
        this.subscription = this.websocketService.receive<ExchangeLimitModel[]>(WebsocketEventEnum.exchangeLimits).subscribe(result => {
            this.limits = result.map(limit => ({
                key: `${limit.type}-${limit.intervalNumber}-${limit.interval}`.toLowerCase(),
                total: limit.total,
                totalLeft: limit.totalLeft
            }));
        });
    }

    public ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
