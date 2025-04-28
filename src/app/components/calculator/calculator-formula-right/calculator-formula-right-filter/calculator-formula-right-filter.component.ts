import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HelperService } from '@core/services/helper.service';
import { FormInputNumberComponent } from '@core/components/form-input-number/form-input-number.component';
import { FormSelectComponent } from '@core/components/form-select/form-select.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { KeyValueModel } from '@core/models/key-value.model';
import { CalculatorFormulaPresetModel } from '@app/models/calculator-formula-preset/calculator-formula-preset.model';
import { CalculatorFormulaPresetService } from '@app/services/calculator-formula-preset/calculator-formula-preset.service';
import { CalculatorFilterEnum } from '@app/enums/calculator-formula-preset/calculator-filter.enum';
import { CalculatorFilterModel } from '@app/models/calculator-formula-preset/calculator-filter.model';

@Component({
    selector: 'app-calculator-formula-right-filter',
    templateUrl: './calculator-formula-right-filter.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormInputNumberComponent, FormSelectComponent, TranslateModule, SvgIconComponent]
})
export class CalculatorFormulaRightFilterComponent implements OnInit, OnDestroy {
    private subscriptionPreset: Subscription;
    protected formGroup: FormGroup;
    protected preset: CalculatorFormulaPresetModel;
    protected types: KeyValueModel[];

    constructor(private readonly formBuilder: FormBuilder,
                private readonly calculatorFormulaPresetService: CalculatorFormulaPresetService) {
        this.formGroup = this.formBuilder.group({
            filters: this.formBuilder.array([]),
        });
    }

    public ngOnInit(): void {
        this.types = HelperService.convertEnumToKeyValue(CalculatorFilterEnum, 'filter-type');

        this.subscriptionPreset = this.calculatorFormulaPresetService.selectedSubject.subscribe((response: CalculatorFormulaPresetModel) => {
            let create = response?.id !== this.preset?.id; // обязательно до присвоения response
            this.preset = response;
            this.updateForm(create);
        });
    }

    public ngOnDestroy(): void {
        if (this.subscriptionPreset) this.subscriptionPreset.unsubscribe();
    }

    get filters(): FormArray {
        return this.formGroup?.get('filters') as FormArray || new FormArray([]);
    }

    private updateForm(create: boolean): void {
        if (!this.preset && this.formGroup) {
            this.formGroup.reset();
            this.filters.clear();
        } else if (!create && this.formGroup && this.preset.filters) {
            const formArray = this.filters;

            this.preset.filters.forEach((item, index) => {
                if (formArray.at(index)) {
                    formArray.at(index).patchValue({
                        filter: item.filter,
                        value: item.value
                    }, {emitEvent: false});
                } else {
                    formArray.push(this.createGroup(item));
                }
            });

            while (formArray.length > this.preset.filters.length) {
                formArray.removeAt(formArray.length - 1);
            }
        } else {
            this.formGroup = this.formBuilder.group({
                filters: this.formBuilder.array(this.preset.filters?.map(item => this.createGroup(item)) || [])
            });
        }
    }

    private createGroup(item: CalculatorFilterModel): FormGroup {
        return this.formBuilder.group({
            filter: [item.filter],
            value: [item.value]
        });
    }

    public onChange(index: number, field: string, value: any): void {
        if (!this.preset || !this.preset.filters) return;

        const filter = this.preset.filters[index];
        if (!filter) return;

        if (field === 'filter') {
            const type = this.types[value]?.key;
            if (type) filter.filter = type as CalculatorFilterEnum;
        } else if (field === 'value') {
            filter[field] = Number(value);
        }

        this.calculatorFormulaPresetService.selectedSubject.next(this.preset);
    }

    public onDelete(index: number): void {
        if (this.preset && this.preset.filters) {
            this.preset.filters.splice(index, 1);
            this.filters.removeAt(index);
            this.calculatorFormulaPresetService.selectedSubject.next(this.preset);
        }
    }
}
