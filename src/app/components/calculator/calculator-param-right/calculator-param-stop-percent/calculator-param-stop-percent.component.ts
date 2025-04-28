import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormInputNumberComponent } from '@core/components/form-input-number/form-input-number.component';
import { CalculatorPresetModel } from '@app/models/calculator-preset/calculator-preset.model';
import { CalculatorPresetService } from '@app/services/calculator-preset/calculator-preset.service';

@Component({
    selector: 'app-calculator-param-stop-percent',
    templateUrl: './calculator-param-stop-percent.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, FormInputNumberComponent]
})
export class CalculatorParamStopPercentComponent implements OnInit, OnDestroy {
    @Input() formGroup: FormGroup;
    private subscription: Subscription;

    constructor(private readonly calculatorPresetService: CalculatorPresetService) {
    }

    public ngOnInit(): void {
        this.subscription = this.calculatorPresetService.selectedSubject.subscribe((response: CalculatorPresetModel) => {
            if (response) {
                this.formGroup.patchValue({
                    stopPercent: response.stopPercent,
                    stopPercentFrom: response.stopPercentFrom,
                    stopPercentTo: response.stopPercentTo,
                    stopPercentStep: response.stopPercentStep
                });
            }
        });

        this.formGroup.get('stopPercent').valueChanges.subscribe((checked: boolean) => {
            this.toggleFields(checked);
        });

        this.toggleFields(this.formGroup.get('stopPercent').value);
    }

    public ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }

    private toggleFields(checked: boolean): void {
        if (checked) {
            this.formGroup.get('stopPercentFrom').enable();
            this.formGroup.get('stopPercentTo').enable();
            this.formGroup.get('stopPercentStep').enable();
        } else {
            this.formGroup.get('stopPercentFrom').disable();
            this.formGroup.get('stopPercentTo').disable();
            this.formGroup.get('stopPercentStep').disable();
        }
    }
}
