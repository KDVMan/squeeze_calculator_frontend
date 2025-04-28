import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HelperService } from '@core/services/helper.service';
import { FormInputNumberComponent } from '@core/components/form-input-number/form-input-number.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { KeyValueModel } from '@core/models/key-value.model';
import { CalculatorFormulaPresetService } from '@app/services/calculator-formula-preset/calculator-formula-preset.service';
import { CalculatorFormulaPresetModel } from '@app/models/calculator-formula-preset/calculator-formula-preset.model';
import { CalculatorFilterEnum } from '@app/enums/calculator-formula-preset/calculator-filter.enum';
import { CalculatorFormulaModel } from '@app/models/calculator-formula-preset/calculator-formula.model';

@Component({
    selector: 'app-calculator-formula-right-formula',
    templateUrl: './calculator-formula-right-formula.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormInputNumberComponent, TranslateModule, SvgIconComponent]
})
export class CalculatorFormulaRightFormulaComponent implements OnInit, OnDestroy {
    private subscriptionPreset: Subscription;
    protected formGroup: FormGroup;
    protected preset: CalculatorFormulaPresetModel;
    protected types: KeyValueModel[];

    constructor(private readonly formBuilder: FormBuilder,
                private readonly calculatorFormulaPresetService: CalculatorFormulaPresetService) {
        this.formGroup = this.formBuilder.group({
            formulas: this.formBuilder.array([]),
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

    get formulas(): FormArray {
        return this.formGroup?.get('formulas') as FormArray || new FormArray([]);
    }

    private updateForm(create: boolean): void {
        if (!this.preset && this.formGroup) {
            this.formGroup.reset();
            this.formulas.clear();
        } else if (!create && this.formGroup && this.preset.formulas) {
            const formArray = this.formulas;

            this.preset.formulas.forEach((item, index) => {
                if (formArray.at(index)) {
                    formArray.at(index).patchValue({
                        multiplier: item.multiplier
                    }, {emitEvent: false});
                } else {
                    formArray.push(this.createGroup(item));
                }
            });

            while (formArray.length > this.preset.formulas.length) {
                formArray.removeAt(formArray.length - 1);
            }
        } else {
            this.formGroup = this.formBuilder.group({
                formulas: this.formBuilder.array(this.preset.formulas?.map(item => this.createGroup(item)) || [])
            });
        }
    }

    private createGroup(item: CalculatorFormulaModel): FormGroup {
        return this.formBuilder.group({
            multiplier: [item.multiplier]
        });
    }

    public onChange(index: number, value: any): void {
        if (!this.preset || !this.preset.formulas) return;

        const formula = this.preset.formulas[index];
        if (!formula) return;

        // const validNumberRegex = /^-?\d*\.?\d+$/; // проверка на точку и минус, иначе отправляет и не дает ввести число с точкой
        // if (!validNumberRegex.test(value)) return;

        formula.multiplier = Number(value);

        this.calculatorFormulaPresetService.selectedSubject.next(this.preset);
    }

    public onDelete(index: number): void {
        if (this.preset && this.preset.formulas) {
            this.preset.formulas.splice(index, 1);
            this.formulas.removeAt(index);
            this.calculatorFormulaPresetService.selectedSubject.next(this.preset);
        }
    }
}
