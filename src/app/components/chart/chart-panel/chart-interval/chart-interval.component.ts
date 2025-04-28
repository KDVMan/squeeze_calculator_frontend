import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChartIntervalSelectComponent } from '@app/components/chart/chart-panel/chart-interval-select/chart-interval-select.component';
import { QuoteIntervalModel } from '@app/models/quote/quote-interval.model';
import { InitService } from '@app/services/init/init.service';
import { InitSubjectModel } from '@app/models/init/init-subject.model';
import { InitSenderEnum } from '@app/enums/init/init-sender.enum';

@Component({
    selector: 'app-chart-interval',
    templateUrl: './chart-interval.component.html',
    styleUrl: './chart-interval.component.scss',
    standalone: true,
    imports: [CommonModule, TranslateModule, ChartIntervalSelectComponent]
})
export class ChartIntervalComponent implements OnInit, OnDestroy {
    private subscriptionInit: Subscription;
    public intervals: QuoteIntervalModel[];

    constructor(private readonly initService: InitService) {
    }

    ngOnInit(): void {
        this.intervals = this.initService.model.intervals.filter(interval => interval.favorite);

        this.subscriptionInit = this.initService.updateSubject.subscribe((response: InitSubjectModel) => {
            if (response.senders.some(x => x === InitSenderEnum.interval || x === InitSenderEnum.intervalFavorite)) {
                this.intervals = response.model.intervals.filter(interval => interval.favorite);
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.subscriptionInit) this.subscriptionInit.unsubscribe();
    }

    public onClick(interval: QuoteIntervalModel): void {
        this.initService.update({
            interval: interval
            // }, [InitSenderEnum.interval], {yRescale: false});
        }, [InitSenderEnum.interval]);
    }
}
