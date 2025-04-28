import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormInputNumberComponent } from '@core/components/form-input-number/form-input-number.component';
import { CalculatorPresetModel } from '@app/models/calculator-preset/calculator-preset.model';
import { CalculatorPresetService } from '@app/services/calculator-preset/calculator-preset.service';

@Component({
    selector: 'app-calculator-param-iteration',
    templateUrl: './calculator-param-iteration.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, FormInputNumberComponent]
})
export class CalculatorParamIterationComponent implements OnInit, OnDestroy {
    @Input() formGroup: FormGroup;
    private subscriptionCalculator: Subscription;
    private subscriptionForm: Subscription;
    public count: number = 0;

    constructor(private readonly calculatorPresetService: CalculatorPresetService) {
    }

    public ngOnInit(): void {
        this.subscriptionCalculator = this.calculatorPresetService.selectedSubject.subscribe((response: CalculatorPresetModel) => {
            if (response) {
                this.formGroup.patchValue({
                    iterations: response.iterations
                });
            }
        });

        this.subscriptionForm = this.formGroup.valueChanges.subscribe(() => {
            if (this.formGroup.valid && this.formGroup.get('bind').disabled === false) {
                this.count = this.getCount(this.formGroup.value);
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.subscriptionCalculator) this.subscriptionCalculator.unsubscribe();
        if (this.subscriptionForm) this.subscriptionForm.unsubscribe();
    }

    private getCount(calculatorPresetModel: CalculatorPresetModel): number {
        let stopCombinations = 0;

        const percentInStep = calculatorPresetModel.percentInStep || 1;
        const percentOutStep = calculatorPresetModel.percentOutStep || 1;
        const stopTimeStep = calculatorPresetModel.stopTime ? (calculatorPresetModel.stopTimeStep || 1) : 1;
        const stopPercentStep = calculatorPresetModel.stopPercent ? (calculatorPresetModel.stopPercentStep || 1) : 1;
        const percentInIterations = Math.floor((calculatorPresetModel.percentInTo - calculatorPresetModel.percentInFrom) / percentInStep) + 1;
        const percentOutIterations = Math.floor((calculatorPresetModel.percentOutTo - calculatorPresetModel.percentOutFrom) / percentOutStep) + 1;
        const stopTimeIterations = calculatorPresetModel.stopTime ? Math.floor((calculatorPresetModel.stopTimeTo - calculatorPresetModel.stopTimeFrom) / stopTimeStep) + 1 : 0;
        const stopPercentIterations = calculatorPresetModel.stopPercent ? Math.floor((calculatorPresetModel.stopPercentTo - calculatorPresetModel.stopPercentFrom) / stopPercentStep) + 1 : 0;
        const bindIterations = calculatorPresetModel.bind ? calculatorPresetModel.bind.length : 1;

        if (stopTimeIterations > 0 && stopPercentIterations > 0) {
            stopCombinations = stopTimeIterations + stopPercentIterations + (stopTimeIterations * stopPercentIterations);
        } else if (stopTimeIterations > 0) {
            stopCombinations = stopTimeIterations;
        } else if (stopPercentIterations > 0) {
            stopCombinations = stopPercentIterations;
        } else {
            stopCombinations = 1;
        }

        const result = percentInIterations * percentOutIterations * stopCombinations * bindIterations;

        return isFinite(result) ? result : 0;
    }
}
