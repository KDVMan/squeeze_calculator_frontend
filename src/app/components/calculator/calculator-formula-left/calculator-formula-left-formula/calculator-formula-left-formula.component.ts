import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormSelectComponent } from '@core/components/form-select/form-select.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { HelperService } from '@core/services/helper.service';
import { CalculatorFieldEnum, calculatorFieldExclusion } from '@app/enums/calculator/calculator-field.enum';
import { Subscription } from 'rxjs';
import { KeyValueModel } from '@core/models/key-value.model';
import { CalculatorFormulaPresetModel } from '@app/models/calculator-formula-preset/calculator-formula-preset.model';
import { CalculatorFormulaPresetService } from '@app/services/calculator-formula-preset/calculator-formula-preset.service';

@Component({
    selector: 'app-calculator-formula-left-formula',
    templateUrl: './calculator-formula-left-formula.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, FormSelectComponent, SvgIconComponent]
})
export class CalculatorFormulaLeftFormulaComponent implements OnInit, OnDestroy {
    private subscriptionPreset: Subscription;
    public formGroup: FormGroup;
    public items: KeyValueModel[];
    public selectEnable: boolean = false;
    public buttonEnable: boolean = false;
    protected preset: CalculatorFormulaPresetModel;
    private index: number = -1;

    constructor(private readonly formBuilder: FormBuilder,
                private readonly calculatorFormulaPresetService: CalculatorFormulaPresetService) {
        this.items = HelperService.convertEnumToKeyValue(CalculatorFieldEnum, 'filter', calculatorFieldExclusion.formula);
    }

    public ngOnInit(): void {
        this.formGroup = this.formBuilder.group({
            formula: ''
        });

        this.subscriptionPreset = this.calculatorFormulaPresetService.selectedSubject.subscribe((response: CalculatorFormulaPresetModel) => {
            this.preset = response;
            this.selectEnable = !!this.preset;
            this.checkEnable();
        });
    }

    public ngOnDestroy(): void {
        if (this.subscriptionPreset) this.subscriptionPreset.unsubscribe();
    }

    public onSelect(index: number): void {
        this.index = index;
        this.checkEnable();
    }

    public onAdd(): void {
        if (!this.preset.formulas) this.preset.formulas = [];

        this.preset.formulas.push({
            name: this.formGroup.get('formula').value,
            multiplier: 0
        });

        this.calculatorFormulaPresetService.selectedSubject.next(this.preset);
        this.formGroup.get('formula').setValue('');
        this.index = -1;
    }

    private checkEnable(): void {
        this.buttonEnable = this.index > -1 && this.preset != null; // использовать === нельзя т.к. может быть undefined
        this.selectEnable = this.preset != null;

        if (this.selectEnable) {
            this.formGroup.enable();
        } else {
            this.formGroup.get('formula').setValue('');
            this.formGroup.disable();
            this.index = -1;
        }
    }
}
