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
    selector: 'app-chart-settings-information',
    templateUrl: './chart-settings-information.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormInputNumberComponent, FormInputColorComponent]
})
export class ChartSettingsInformationComponent implements OnInit, OnDestroy {
    private subscriptionFormGroup: Subscription;
    public formGroup: FormGroup;

    public directions = [
        {name: 'up', title: 'Рост'},
        {name: 'down', title: 'Падение'}
    ];

    public fields = [
        {name: 'priceOpenName', title: 'Открытие (название)'},
        {name: 'priceOpenValue', title: 'Открытие (значение)'},
        {name: 'priceHighName', title: 'Максимум (название)'},
        {name: 'priceHighValue', title: 'Максимум (значение)'},
        {name: 'priceLowName', title: 'Минимум (название)'},
        {name: 'priceLowValue', title: 'Минимум (значение)'},
        {name: 'priceCloseName', title: 'Закрытие (название)'},
        {name: 'priceCloseValue', title: 'Закрытие (значение)'},
        {name: 'volumeName', title: 'Объем (название)'},
        {name: 'volumeValue', title: 'Объем (значение)'},
        {name: 'tradesName', title: 'Количество сделок (название)'},
        {name: 'tradesValue', title: 'Количество сделок (значение)'},
        // {name: 'indexName', title: 'Номер свечи (название)'},
        // {name: 'indexValue', title: 'Номер свечи (значение)'},
        // {name: 'activatorName', title: 'Активатор (название)'},
        // {name: 'activatorValue', title: 'Активатор (значение)'},
        // {name: 'positionName', title: 'Позиция (название)'},
        // {name: 'positionValue', title: 'Позиция (значение)'}
    ];

    public positions = this.fields.filter(field =>
        field.name === 'positionName' || field.name === 'positionValue'
    );

    constructor(private readonly formBuilder: FormBuilder,
                private readonly configService: ConfigService,
                private readonly chartSettingsService: ChartSettingsService) {
    }

    public ngOnInit(): void {
        this.formGroup = HelperService.createFormGroupFromModel(this.formBuilder, this.chartSettingsService.model.information);

        this.subscriptionFormGroup = this.formGroup.valueChanges.pipe(
            debounceTime(this.configService.get('settings.formDebounceTime')),
            distinctUntilChanged()
        ).subscribe(_ => {
            this.chartSettingsService.updateModel({
                information: HelperService.createModelFromFormGroup(this.formGroup)
            });
        });
    }

    public ngOnDestroy(): void {
        if (this.subscriptionFormGroup) this.subscriptionFormGroup.unsubscribe();
    }
}
