import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormInputNumberComponent } from '@core/components/form-input-number/form-input-number.component';
import { CalculatorPresetService } from '@app/services/calculator-preset/calculator-preset.service';
import { CalculatorPresetModel } from '@app/models/calculator-preset/calculator-preset.model';

@Component({
    selector: 'app-calculator-param-stop-time',
    templateUrl: './calculator-param-stop-time.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, FormInputNumberComponent]
})
export class CalculatorParamStopTimeComponent implements OnInit, OnDestroy {
    @Input() formGroup: FormGroup;
    private subscription: Subscription;

    constructor(private readonly calculatorPresetService: CalculatorPresetService) {
    }

    public ngOnInit(): void {
        this.subscription = this.calculatorPresetService.selectedSubject.subscribe((response: CalculatorPresetModel) => {
            if (response) {
                this.formGroup.patchValue({
                    stopTime: response.stopTime,
                    stopTimeFrom: response.stopTimeFrom,
                    stopTimeTo: response.stopTimeTo,
                    stopTimeStep: response.stopTimeStep
                });
            }
        });

        this.formGroup.get('stopTime').valueChanges.subscribe((checked: boolean) => {
            this.toggleFields(checked);
        });

        this.toggleFields(this.formGroup.get('stopTime').value);
    }

    public ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }

    private toggleFields(checked: boolean): void {
        if (checked) {
            this.formGroup.get('stopTimeFrom').enable();
            this.formGroup.get('stopTimeTo').enable();
            this.formGroup.get('stopTimeStep').enable();
        } else {
            this.formGroup.get('stopTimeFrom').disable();
            this.formGroup.get('stopTimeTo').disable();
            this.formGroup.get('stopTimeStep').disable();
        }
    }
}
