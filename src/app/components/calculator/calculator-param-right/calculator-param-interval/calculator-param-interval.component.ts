import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormSelectComponent } from '@core/components/form-select/form-select.component';
import { HelperService } from '@core/services/helper.service';
import { IntervalEnum } from '@core/enums/interval.enum';
import { KeyValueModel } from '@core/models/key-value.model';
import { CalculatorPresetService } from '@app/services/calculator-preset/calculator-preset.service';
import { CalculatorPresetModel } from '@app/models/calculator-preset/calculator-preset.model';

@Component({
    selector: 'app-calculator-param-interval',
    templateUrl: './calculator-param-interval.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, FormSelectComponent]
})
export class CalculatorParamIntervalComponent implements OnInit, OnDestroy {
    @Input() formGroup: FormGroup;
    private subscription: Subscription;
    public intervals: KeyValueModel[];

    constructor(private readonly calculatorPresetService: CalculatorPresetService) {
        this.intervals = HelperService.convertEnumToKeyValue(IntervalEnum, 'M002');
    }

    public ngOnInit(): void {
        this.subscription = this.calculatorPresetService.selectedSubject.subscribe((response: CalculatorPresetModel) => {
            if (response) {
                this.formGroup.get('interval').patchValue(response.interval);
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
