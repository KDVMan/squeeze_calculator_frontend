import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalculatorPresetService } from '@app/services/calculator-preset/calculator-preset.service';
import { CalculatorPresetModel } from '@app/models/calculator-preset/calculator-preset.model';
import { Subscription } from 'rxjs';
import { HelperService } from '@core/services/helper.service';
import { KeyValueModel } from '@core/models/key-value.model';
import { FormSelectComponent } from '@core/components/form-select/form-select.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { CalculatorPresetSubjectModel } from '@app/models/calculator-preset/calculator-preset-subject.model';
import { CalculatorPresetSenderEnum } from '@app/enums/calculator-preset/calculator-preset-sender.enum';

@Component({
    selector: 'app-calculator-param-left-preset',
    templateUrl: './calculator-param-left-preset.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormSelectComponent, SvgIconComponent]
})
export class CalculatorParamLeftPresetComponent implements OnInit, OnDestroy {
    private subscriptionFormGroup: Subscription;
    private subscriptionPreset: Subscription;
    public formGroup: FormGroup;
    public presets: KeyValueModel[];
    public buttonAddShow: boolean = true;
    public buttonAddEnable: boolean = false;
    public buttonEditShow: boolean = false;
    public buttonEditEnable: boolean = false;
    public buttonDeleteShow: boolean = false;
    private selectedIndex: number = -1;
    private selectedPreset: CalculatorPresetModel = null;
    public isCtrlPressed: boolean = false;

    constructor(private readonly formBuilder: FormBuilder,
                private readonly calculatorPresetService: CalculatorPresetService) {
    }

    public ngOnInit(): void {
        this.selectedPreset = this.calculatorPresetService.models.find(preset => preset.selected);

        this.formGroup = this.formBuilder.group({
            preset: this.calculatorPresetService.models.find(preset => preset.selected)?.name || ''
        });

        this.subscriptionFormGroup = this.formGroup.get('preset').valueChanges.subscribe((value: string) => {
            this.onChange(value?.trim());
        });

        this.subscriptionPreset = this.calculatorPresetService.updateSubject.subscribe((response: CalculatorPresetSubjectModel) => {
            this.presets = HelperService.convertArrayToKeyValue(response.models.map(x => x.name));

            if (response.senders.includes(CalculatorPresetSenderEnum.duplicate)) {
                const selectedIndex = response.models.findIndex(x => x.selected);
                this.formGroup.get('preset').setValue(response.models[selectedIndex]?.name ?? '');
                this.onSelect(selectedIndex, false);
            } else {
                let edit = this.selectedPreset?.id != response.models.find(preset => preset.selected)?.id; // иначе будет зацикливание
                this.onSelect(response.models.findIndex(x => x.name === this.formGroup.get('preset').value), edit);
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.subscriptionFormGroup) this.subscriptionFormGroup.unsubscribe();
        if (this.subscriptionPreset) this.subscriptionPreset.unsubscribe();
    }

    private onChange(value: string): void {
        this.buttonAddShow = false;
        this.buttonEditShow = false;
        this.buttonDeleteShow = false;

        if (this.selectedIndex === -1) {
            this.buttonAddShow = true;
            this.buttonAddEnable = value && this.calculatorPresetService.models.some(x => x.name === value) === false;
        } else if (value) {
            this.buttonEditShow = true;
            this.buttonEditEnable = this.calculatorPresetService.models.some(x => x.name === value) === false;
        } else {
            this.buttonDeleteShow = true;
        }
    }

    public onSelect(index: number, edit: boolean = true): void {
        this.selectedIndex = index;
        this.selectedPreset = index >= 0 ? this.calculatorPresetService.models[index] : null;

        if (this.selectedIndex > -1) {
            this.buttonAddShow = false;
            this.buttonEditShow = true;
            this.buttonDeleteShow = false;

            if (edit) {
                this.calculatorPresetService.edit({
                    id: this.selectedPreset.id,
                    name: this.selectedPreset.name
                });
            }
        } else {
            this.buttonAddShow = true;
            this.buttonAddEnable = false;
            this.buttonEditShow = false;
            this.buttonDeleteShow = false;
        }

        this.calculatorPresetService.selectedSubject.next(this.selectedPreset);
    }

    public onAdd(): void {
        this.calculatorPresetService.add({
            name: this.formGroup.get('preset').value
        });
    }

    public onEdit(): void {
        this.buttonEditEnable = false;

        this.calculatorPresetService.edit({
            id: this.selectedPreset.id,
            name: this.formGroup.get('preset').value
        });
    }

    public onDuplicate(): void {
        this.calculatorPresetService.duplicate({
            id: this.selectedPreset.id
        });
    }

    public onDelete(): void {
        this.calculatorPresetService.delete({
            id: this.selectedPreset.id
        });
    }

    @HostListener('window:keydown', ['$event'])
    public onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Control') {
            this.isCtrlPressed = true;
        }
    }

    @HostListener('window:keyup', ['$event'])
    public onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Control') {
            this.isCtrlPressed = false;
        }
    }
}
