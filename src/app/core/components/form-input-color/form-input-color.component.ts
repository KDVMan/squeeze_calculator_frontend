import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerDirective } from 'ngx-color-picker';

@Component({
	selector: 'app-form-input-color',
	templateUrl: './form-input-color.component.html',
	styleUrl: './form-input-color.component.scss',
	imports: [ReactiveFormsModule, NgbTooltip, ColorPickerDirective]
})
export class FormInputColorComponent implements OnInit {
	@Input() name: string;
	@Input() width: number;
	@Input() widthMax: boolean;
	@Input() height: number;
	@Input() tooltip: string;
	@Input() tooltipDelay: number = 300;
	public formGroup: FormGroup;
	public color: string;

	constructor(private controlContainer: ControlContainer) {
	}

	ngOnInit(): void {
		this.formGroup = <FormGroup>this.controlContainer.control;
		this.color = this.formGroup.get(this.name).value;
	}

	public onChangeColor(event: string): void {
		this.formGroup.get(this.name).patchValue(event);
	}
}
