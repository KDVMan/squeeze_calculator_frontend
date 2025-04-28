import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ConfigService } from '@core/services/config.service';
import { FormInputNumberComponent } from '@core/components/form-input-number/form-input-number.component';
import { FormInputColorComponent } from '@core/components/form-input-color/form-input-color.component';
import { HelperService } from '@core/services/helper.service';
import { NgForOf } from '@angular/common';
import { ChartSettingsService } from '@app/services/chart-settings/chart-settings.service';

@Component({
    selector: 'app-chart-settings-candle',
    templateUrl: './chart-settings-candle.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, FormInputNumberComponent, FormInputColorComponent, NgForOf]
})
export class ChartSettingsCandleComponent implements OnInit, OnDestroy {
    private subscriptionFormGroup: Subscription;
    public formGroup: FormGroup;

    public directions = [
        {name: 'up', title: 'Рост'},
        {name: 'down', title: 'Падение'}
    ];

    constructor(private readonly formBuilder: FormBuilder,
                private readonly configService: ConfigService,
                private readonly chartSettingsService: ChartSettingsService) {
    }

    public ngOnInit(): void {
        this.formGroup = HelperService.createFormGroupFromModel(this.formBuilder, this.chartSettingsService.model.candle);

        this.subscriptionFormGroup = this.formGroup.valueChanges.pipe(
            debounceTime(this.configService.get('settings.formDebounceTime')),
            distinctUntilChanged()
        ).subscribe(_ => {
            this.chartSettingsService.updateModel({
                candle: HelperService.createModelFromFormGroup(this.formGroup)
            });
        });
    }

    public ngOnDestroy(): void {
        if (this.subscriptionFormGroup) this.subscriptionFormGroup.unsubscribe();
    }
}
