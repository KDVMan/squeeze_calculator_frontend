import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalculatorFormulaLeftPresetComponent } from '@app/components/calculator/calculator-formula-left/calculator-formula-left-preset/calculator-formula-left-preset.component';
import { CalculatorFormulaLeftFilterComponent } from '@app/components/calculator/calculator-formula-left/calculator-formula-left-filter/calculator-formula-left-filter.component';
import { CalculatorFormulaLeftFormulaComponent } from '@app/components/calculator/calculator-formula-left/calculator-formula-left-formula/calculator-formula-left-formula.component';
import { CalculatorFormulaPresetService } from '@app/services/calculator-formula-preset/calculator-formula-preset.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-calculator-formula-left',
    templateUrl: './calculator-formula-left.component.html',
    styleUrl: './calculator-formula-left.component.scss',
    standalone: true,
    imports: [CalculatorFormulaLeftPresetComponent, CalculatorFormulaLeftFilterComponent, CalculatorFormulaLeftFormulaComponent]
})
export class CalculatorPanelComponent implements OnInit, OnDestroy {
    private subscriptionSet: Subscription;
    private subscriptionSelect: Subscription;
    private currentHash: string;
    protected disableButton: boolean = true;

    constructor(private readonly calculatorFormulaPresetService: CalculatorFormulaPresetService) {
    }

    public ngOnInit(): void {
        let selectedPreset = this.calculatorFormulaPresetService.models.find(preset => preset.selected);

        if (selectedPreset) {
            this.currentHash = this.calculatorFormulaPresetService.getHash(selectedPreset);
        }

        this.subscriptionSet = this.calculatorFormulaPresetService.setSubject.subscribe(preset => {
            if (preset) {
                let hash = this.calculatorFormulaPresetService.getHash(preset);
                this.disableButton = this.currentHash === hash;
                this.currentHash = hash;
            }
        });

        this.subscriptionSelect = this.calculatorFormulaPresetService.selectedSubject.subscribe(preset => {
            if (preset) {
                let hash = this.calculatorFormulaPresetService.getHash(preset);
                this.disableButton = this.currentHash === hash;
                this.currentHash = hash;
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.subscriptionSet) this.subscriptionSet.unsubscribe();
        if (this.subscriptionSelect) this.subscriptionSelect.unsubscribe();
    }

    public onClick(): void {
        let selectedPreset = this.calculatorFormulaPresetService.models.find(preset => preset.selected);

        if (selectedPreset) {
            this.calculatorFormulaPresetService.update(selectedPreset);
        }
    }
}
