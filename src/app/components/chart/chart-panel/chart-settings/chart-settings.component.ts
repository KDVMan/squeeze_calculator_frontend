import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef, NgbNavModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { SvgIconComponent } from 'angular-svg-icon';
import { first } from 'rxjs';
import { ChartSettingsService } from '@app/services/chart-settings/chart-settings.service';
import { ChartSettingsCommonComponent } from '@app/components/chart/chart-panel/chart-settings/chart-settings-common/chart-settings-common.component';
import { ChartSettingsMouseComponent } from '@app/components/chart/chart-panel/chart-settings/chart-settings-mouse/chart-settings-mouse.component';
import { ChartSettingsGridComponent } from '@app/components/chart/chart-panel/chart-settings/chart-settings-grid/chart-settings-grid.component';
import { ChartSettingsCandleComponent } from '@app/components/chart/chart-panel/chart-settings/chart-settings-candles/chart-settings-candle.component';
import { ChartSettingsVolumeComponent } from '@app/components/chart/chart-panel/chart-settings/chart-settings-volume/chart-settings-volume.component';
import { ChartSettingsLegendComponent } from '@app/components/chart/chart-panel/chart-settings/chart-settings-legend/chart-settings-legend.component';
import { ChartSettingsCurrentPriceComponent } from '@app/components/chart/chart-panel/chart-settings/chart-settings-current-price/chart-settings-current-price.component';
import { ChartSettingsAimComponent } from '@app/components/chart/chart-panel/chart-settings/chart-settings-aim/chart-settings-aim.component';
import { ChartSettingsRulerComponent } from '@app/components/chart/chart-panel/chart-settings/chart-settings-ruler/chart-settings-ruler.component';
import { ChartSettingsInformationComponent } from '@app/components/chart/chart-panel/chart-settings/chart-settings-information/chart-settings-information.component';

@Component({
    selector: 'app-chart-settings',
    templateUrl: './chart-settings.component.html',
    styleUrl: './chart-settings.component.scss',
    standalone: true,
    imports: [
        CommonModule, NgbNavModule, NgbTooltip, SvgIconComponent, ChartSettingsCommonComponent, ChartSettingsMouseComponent, ChartSettingsGridComponent,
        ChartSettingsCandleComponent, ChartSettingsVolumeComponent, ChartSettingsLegendComponent, ChartSettingsCurrentPriceComponent, ChartSettingsAimComponent,
        ChartSettingsRulerComponent, ChartSettingsInformationComponent
    ]
})
export class ChartSettingsComponent implements AfterViewInit {
    @ViewChild('content') content: ElementRef;
    public active: string = 'candle';

    constructor(private readonly modalService: NgbModal,
                private readonly confirmDialogService: ConfirmDialogService,
                private readonly chartSettingsService: ChartSettingsService) {
    }

    public ngAfterViewInit(): void {
        // this.onOpen(this.content);
    }

    public onSave(modal: NgbModalRef): void {
        this.chartSettingsService.save()
            .pipe(first())
            .subscribe(_ => {
                modal.close();
            });
    }

    public onCancel(modal: NgbModalRef): void {
        this.chartSettingsService.cancel();
        modal.dismiss();
    }

    public onReset(): void {
        this.confirmDialogService.confirm('Сбросить все настройки графика по умолчанию?',
            () => {
                this.chartSettingsService.reset().pipe(first()).subscribe(_ => {
                    this.modalService.dismissAll();
                });
            },
            () => null
        );
    }

    public onOpen(content: any): void {
        this.modalService.open(content, {
            backdrop: false,
            centered: true,
            animation: false,
            keyboard: false,
            scrollable: true,
            modalDialogClass: 'custom-modal'
        });
    }
}
