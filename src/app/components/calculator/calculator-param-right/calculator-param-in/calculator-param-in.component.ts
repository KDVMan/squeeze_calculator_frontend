import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormInputNumberComponent } from '@core/components/form-input-number/form-input-number.component';
import { CalculatorPresetModel } from '@app/models/calculator-preset/calculator-preset.model';
import { CalculatorPresetService } from '@app/services/calculator-preset/calculator-preset.service';

@Component({
    selector: 'app-calculator-param-in',
    templateUrl: './calculator-param-in.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, FormInputNumberComponent]
})
export class CalculatorParamInComponent implements OnInit, OnDestroy {
    @Input() formGroup: FormGroup;
    private subscription: Subscription;

    constructor(private readonly calculatorPresetService: CalculatorPresetService) {
    }

    public ngOnInit(): void {
        this.subscription = this.calculatorPresetService.selectedSubject.subscribe((response: CalculatorPresetModel) => {
            if (response) {
                this.formGroup.get('percentInFrom').patchValue(response.percentInFrom);
                this.formGroup.get('percentInTo').patchValue(response.percentInTo);
                this.formGroup.get('percentInStep').patchValue(response.percentInStep);
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
