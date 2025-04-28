import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormInputNumberComponent } from '@core/components/form-input-number/form-input-number.component';
import { CalculatorPresetService } from '@app/services/calculator-preset/calculator-preset.service';
import { CalculatorPresetModel } from '@app/models/calculator-preset/calculator-preset.model';

@Component({
    selector: 'app-calculator-param-out',
    templateUrl: './calculator-param-out.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, FormInputNumberComponent]
})
export class CalculatorParamOutComponent implements OnInit, OnDestroy {
    @Input() formGroup: FormGroup;
    private subscription: Subscription;

    constructor(private readonly calculatorPresetService: CalculatorPresetService) {
    }

    public ngOnInit(): void {
        this.subscription = this.calculatorPresetService.selectedSubject.subscribe((response: CalculatorPresetModel) => {
            if (response) {
                this.formGroup.get('percentOutFrom').patchValue(response.percentOutFrom);
                this.formGroup.get('percentOutTo').patchValue(response.percentOutTo);
                this.formGroup.get('percentOutStep').patchValue(response.percentOutStep);
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
