import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormSelectComponent } from '@core/components/form-select/form-select.component';
import { Subscription } from 'rxjs';
import { SvgIconComponent } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { KeyValueModel } from '@core/models/key-value.model';
import { CalculatorFormulaPresetModel } from '@app/models/calculator-formula-preset/calculator-formula-preset.model';
import { CalculatorFormulaPresetService } from '@app/services/calculator-formula-preset/calculator-formula-preset.service';
import { HelperService } from '@core/services/helper.service';

@Component({
	selector: 'app-calculator-formula-left-preset',
	templateUrl: './calculator-formula-left-preset.component.html',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, FormSelectComponent, SvgIconComponent]
})
export class CalculatorFormulaLeftPresetComponent implements OnInit, OnDestroy {
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
	private selectedPreset: CalculatorFormulaPresetModel = null;
	public isCtrlPressed: boolean = false;

	constructor(private readonly formBuilder: FormBuilder,
				private readonly calculatorFormulaPresetService: CalculatorFormulaPresetService) {
	}

	public ngOnInit(): void {
		this.selectedPreset = this.calculatorFormulaPresetService.models.find(preset => preset.selected);

		this.formGroup = this.formBuilder.group({
			preset: this.calculatorFormulaPresetService.models.find(preset => preset.selected)?.name || ''
		});

		this.subscriptionFormGroup = this.formGroup.get('preset').valueChanges.subscribe((value: string) => {
			this.onChange(value?.trim());
		});

		this.subscriptionPreset = this.calculatorFormulaPresetService.updateSubject.subscribe((response: CalculatorFormulaPresetModel[]) => {
			this.presets = HelperService.convertArrayToKeyValue(response.map(x => x.name));
			let edit = this.selectedPreset?.id != response.find(preset => preset.selected)?.id; // иначе будет зацикливание
			this.onSelect(response.findIndex(x => x.name === this.formGroup.get('preset').value), edit);
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
			this.buttonAddEnable = value && this.calculatorFormulaPresetService.models.some(x => x.name === value) === false;
		} else if (value) {
			this.buttonEditShow = true;
			this.buttonEditEnable = this.calculatorFormulaPresetService.models.some(x => x.name === value) === false;
		} else {
			this.buttonDeleteShow = true;
		}
	}

	public onSelect(index: number, edit: boolean = true): void {
		this.selectedIndex = index;
		this.selectedPreset = index >= 0 ? this.calculatorFormulaPresetService.models[index] : null;

		if (this.selectedIndex > -1) {
			this.buttonAddShow = false;
			this.buttonEditShow = true;
			this.buttonDeleteShow = false;

			if (edit) {
				this.calculatorFormulaPresetService.edit({
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

		this.calculatorFormulaPresetService.selectedSubject.next(this.selectedPreset);
	}

	public onAdd(): void {
		this.calculatorFormulaPresetService.add({
			name: this.formGroup.get('preset').value
		});
	}

	public onEdit(): void {
		this.buttonEditEnable = false;

		this.calculatorFormulaPresetService.edit({
			id: this.selectedPreset.id,
			name: this.formGroup.get('preset').value
		});
	}

	public onDelete(): void {
		this.calculatorFormulaPresetService.delete({
			id: this.selectedPreset.id
		});
	}

	public onDuplicate(): void {
		this.calculatorFormulaPresetService.duplicate({
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
