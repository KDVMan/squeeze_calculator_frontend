import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ScrollToActiveDirective } from '@core/directives/scroll-to-active.directive';
import { TranslateModule } from '@ngx-translate/core';
import { KeyValueModel } from '@core/models/key-value.model';

@Component({
	selector: 'app-form-select',
	templateUrl: './form-select.component.html',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, TranslateModule, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, ScrollToActiveDirective]
})
export class FormSelectComponent implements OnInit, OnChanges {
	@ViewChild('dropdown') dropdown: NgbDropdown;
	@Input() name: string;
	@Input() names: string | null = null;
	@Input() width: number;
	@Input() widthMax: boolean;
	@Input() menuHeightMax: number = 20;
	@Input() addEmpty: boolean = true;
	@Input() tooltip: string;
	@Input() tooltipDelay: number = 300;
	@Input() allowTextInput: boolean = false;
	@Input() allowChanged: boolean = false;
	@Input() enabled: boolean = true;
	@Input() container: null | 'body' = null;
	@Input() items: KeyValueModel[];
	@Input() item: KeyValueModel = null;
	@Output() selectEvent = new EventEmitter<number>();
	public formGroup: FormGroup;
	public itemActive: KeyValueModel;
	public checked = [];

	constructor(private readonly controlContainer: ControlContainer) {
	}

	public ngOnInit(): void {
		this.formGroup = this.controlContainer.control as FormGroup;
		const control = this.formGroup.get(this.name);

		if (control) {
			// что бы в formula при добавлении убиралось из select
			control.valueChanges.subscribe(value => {
				this.itemActive = this.items.find(x => x.key === value) || null;
			});

			control.statusChanges.subscribe(status => {
				this.enabled = status !== 'DISABLED';
			});

			this.enabled = control.status !== 'DISABLED';
		}

		if (this.item) this.itemActive = this.item;
		else if (this.items) this.itemActive = this.getActive();

		if (this.names && this.formGroup.get(this.names)) this.checked = this.formGroup.get(this.names).value || [];
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (this.allowChanged && this.formGroup && this.items) {
			this.itemActive = this.getActive();
			if (this.names && this.formGroup.get(this.names)) this.checked = this.formGroup.get(this.names).value || [];
		}
	}

	public onSelect(item: KeyValueModel): void {
		this.itemActive = item;
		this.formGroup.get(this.name).setValue(item?.key ?? '');
		this.selectEvent.emit(this.items.indexOf(item));
		if (this.names) this.dropdown.close();
	}

	public onCheck(item: KeyValueModel, event: Event): void {
		const checkbox = event.target as HTMLInputElement;

		if (checkbox.checked) this.checked.push(item.key);
		else this.checked = this.checked.filter(value => value !== item.key);

		this.formGroup.get(this.names).setValue(this.checked);
	}

	private getActive(): KeyValueModel {
		return this.items.find(x => x.key === this.formGroup.get(this.name).value) || null;
	}

	public isChecked(item: KeyValueModel): boolean {
		return this.checked.includes(item.key);
	}
}
