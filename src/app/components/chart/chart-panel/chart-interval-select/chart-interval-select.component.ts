import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SvgIconComponent } from 'angular-svg-icon';
import { QuoteIntervalModel } from '@app/models/quote/quote-interval.model';
import { InitService } from '@app/services/init/init.service';
import { InitSubjectModel } from '@app/models/init/init-subject.model';
import { InitSenderEnum } from '@app/enums/init/init-sender.enum';

@Component({
    selector: 'app-chart-interval-select',
    templateUrl: './chart-interval-select.component.html',
    styleUrl: './chart-interval-select.component.scss',
    standalone: true,
    imports: [CommonModule, TranslateModule, NgbModule, SvgIconComponent]
})
export class ChartIntervalSelectComponent implements OnInit, OnDestroy {
    @ViewChild('dropdown', {static: false}) dropdown: NgbDropdown;
    private subscriptionInit: Subscription;
    public intervals: QuoteIntervalModel[];
    public activeInterval: QuoteIntervalModel;
    public hoverFavorite: boolean = false;

    constructor(private readonly initService: InitService) {
    }

    ngOnInit(): void {
        this.intervals = this.initService.model.intervals;
        this.activeInterval = this.intervals.find(interval => interval.active);

        this.subscriptionInit = this.initService.updateSubject.subscribe((response: InitSubjectModel) => {
            if (response.senders.includes(InitSenderEnum.interval)) {
                this.intervals = response.model.intervals;
                this.activeInterval = this.intervals.find(interval => interval.active);
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.subscriptionInit) this.subscriptionInit.unsubscribe();
    }

    public onFavorite(event: MouseEvent, interval: QuoteIntervalModel): void {
        event.stopPropagation();

        interval.favorite = !interval.favorite;

        this.initService.update({
            interval: interval
        }, [InitSenderEnum.intervalFavorite]);
    }

    public onClick(interval: QuoteIntervalModel): void {
        this.initService.update({
            interval: interval
        }, [InitSenderEnum.interval]);

        this.dropdown.close();
    }
}
