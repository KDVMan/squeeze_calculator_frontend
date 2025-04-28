import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartIntervalComponent } from '@app/components/chart/chart-panel/chart-interval/chart-interval.component';
import { Subscription } from 'rxjs';
import { InitService } from '@app/services/init/init.service';
import { InitSubjectModel } from '@app/models/init/init-subject.model';
import { ChartSettingsComponent } from '@app/components/chart/chart-panel/chart-settings/chart-settings.component';

@Component({
    selector: 'app-chart-panel',
    templateUrl: './chart-panel.component.html',
    styleUrl: './chart-panel.component.scss',
    standalone: true,
    imports: [ChartIntervalComponent, ChartSettingsComponent]
})
export class ChartPanelComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    public symbol: string;

    constructor(private readonly initService: InitService) {
    }

    public ngOnInit(): void {
        this.symbol = this.initService.model.symbol;

        this.subscription = this.initService.updateSubject.subscribe((result: InitSubjectModel) => {
            this.symbol = result.model.symbol;
        });
    }

    public ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
