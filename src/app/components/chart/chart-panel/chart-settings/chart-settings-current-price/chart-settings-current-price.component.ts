import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ConfigService } from '@core/services/config.service';
import { FormInputNumberComponent } from '@core/components/form-input-number/form-input-number.component';
import { FormInputColorComponent } from '@core/components/form-input-color/form-input-color.component';
import { FormSelectComponent } from '@core/components/form-select/form-select.component';
import { HelperService } from '@core/services/helper.service';
import { LineTypeEnum } from '@core/enums/line-type.enum';
import { NgForOf } from '@angular/common';
import { ChartSettingsService } from '@app/services/chart-settings/chart-settings.service';
import { KeyValueModel } from '@core/models/key-value.model';

@Component({
    selector: 'app-chart-settings-current-price',
    templateUrl: './chart-settings-current-price.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, FormInputNumberComponent, FormInputColorComponent, FormSelectComponent, NgForOf]
})
export class ChartSettingsCurrentPriceComponent implements OnInit, OnDestroy {
    private subscriptionFormGroup: Subscription;
    public formGroup: FormGroup;
    public lines: KeyValueModel[];

    public directions = [
        {name: 'up', title: 'Рост'},
        {name: 'down', title: 'Падение'}
    ];

    constructor(private readonly formBuilder: FormBuilder,
                private readonly configService: ConfigService,
                private readonly chartSettingsService: ChartSettingsService) {
        this.lines = HelperService.convertEnumToKeyValue(LineTypeEnum, 'line-type');
    }

    public ngOnInit(): void {
        this.formGroup = HelperService.createFormGroupFromModel(this.formBuilder, this.chartSettingsService.model.currentPrice);

        this.subscriptionFormGroup = this.formGroup.valueChanges.pipe(
            debounceTime(this.configService.get('settings.formDebounceTime')),
            distinctUntilChanged()
        ).subscribe(_ => {
            this.chartSettingsService.updateModel({
                currentPrice: HelperService.createModelFromFormGroup(this.formGroup)
            });
        });
    }

    public ngOnDestroy(): void {
        if (this.subscriptionFormGroup) this.subscriptionFormGroup.unsubscribe();
    }
}
