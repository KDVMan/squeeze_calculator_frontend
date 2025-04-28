import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ConfigService } from '@core/services/config.service';
import { FormInputNumberComponent } from '@core/components/form-input-number/form-input-number.component';
import { FormInputColorComponent } from '@core/components/form-input-color/form-input-color.component';
import { HelperService } from '@core/services/helper.service';
import { CommonModule } from '@angular/common';
import { ChartSettingsService } from '@app/services/chart-settings/chart-settings.service';

@Component({
    selector: 'app-chart-settings-legend',
    templateUrl: './chart-settings-legend.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormInputNumberComponent, FormInputColorComponent]
})
export class ChartSettingsLegendComponent implements OnInit, OnDestroy {
    private subscriptionFormGroup: Subscription;
    public formGroup: FormGroup;

    public directions = [
        {name: 'horizontal', title: 'По горизонтали'},
        {name: 'vertical', title: 'По вертикали'}
    ];

    constructor(private readonly formBuilder: FormBuilder,
                private readonly configService: ConfigService,
                private readonly chartSettingsService: ChartSettingsService) {
    }

    public ngOnInit(): void {
        this.formGroup = HelperService.createFormGroupFromModel(this.formBuilder, this.chartSettingsService.model.legend);

        this.subscriptionFormGroup = this.formGroup.valueChanges.pipe(
            debounceTime(this.configService.get('settings.formDebounceTime')),
            distinctUntilChanged()
        ).subscribe(_ => {
            this.chartSettingsService.updateModel({
                legend: HelperService.createModelFromFormGroup(this.formGroup)
            });
        });
    }

    public ngOnDestroy(): void {
        if (this.subscriptionFormGroup) this.subscriptionFormGroup.unsubscribe();
    }
}
