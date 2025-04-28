import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormSelectComponent } from '@core/components/form-select/form-select.component';
import { HelperService } from '@core/services/helper.service';
import { TradeDirectionEnum } from '@core/enums/trade-direction.enum';
import { KeyValueModel } from '@core/models/key-value.model';
import { CalculatorPresetService } from '@app/services/calculator-preset/calculator-preset.service';
import { CalculatorPresetModel } from '@app/models/calculator-preset/calculator-preset.model';

@Component({
    selector: 'app-calculator-param-direction',
    templateUrl: './calculator-param-direction.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, FormSelectComponent]
})
export class CalculatorParamDirectionComponent implements OnInit, OnDestroy {
    @Input() formGroup: FormGroup;
    private subscription: Subscription;
    public directions: KeyValueModel[];

    constructor(private readonly calculatorPresetService: CalculatorPresetService) {
        this.directions = HelperService.convertEnumToKeyValue(TradeDirectionEnum, 'trade-direction');
    }

    public ngOnInit(): void {
        this.subscription = this.calculatorPresetService.selectedSubject.subscribe((response: CalculatorPresetModel) => {
            if (response) {
                this.formGroup.get('tradeDirection').patchValue(response.tradeDirection, {emitEvent: false});
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
