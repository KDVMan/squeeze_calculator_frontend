import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ZeroNumberDirective } from '@core/directives/zero-number.directive';
import { NumberOnlyDirective } from '@core/directives/number-only.directive';
import { SelectOnFocusDirective } from '@core/directives/select-on-focus.directive';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ConfigService } from '@core/services/config.service';

@Component({
	selector: 'app-form-input-number',
	templateUrl: './form-input-number.component.html',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, NgbTooltip, SelectOnFocusDirective, ZeroNumberDirective, NumberOnlyDirective]
})
export class FormInputNumberComponent implements OnInit, OnDestroy {
	@Input() name: string;
	@Input() width: number;
	@Input() widthHalf: boolean;
	@Input() widthMax: boolean;
	@Input() height: number;
	@Input() align: 'left' | 'right' | 'center' = 'left';
	@Input() allowSign: boolean = false;
	@Input() allowDecimal: boolean = false;
	@Input() decimalSeparator: string = '.';
	@Input() maxLength: number;
	@Input() maxDecimalLength: number;
	@Input() tooltip: string;
	@Input() tooltipDelay: number = 300;
	@Input() placeholder: string = '';
	@Input() addString: string = '';
	@Input() delay: number = -1;
	@Output() valueChange = new EventEmitter<number>();
	public formGroup: FormGroup;
	private subscription: Subscription;

	constructor(private controlContainer: ControlContainer,
				private readonly configService: ConfigService) {
	}

	public ngOnInit(): void {
		this.formGroup = <FormGroup>this.controlContainer.control;
		const debounceDelay = this.delay !== -1 ? this.delay : this.configService.get('settings.formDebounceTime');

		this.subscription = this.formGroup.get(this.name).valueChanges.pipe(
			debounceTime(debounceDelay),
			distinctUntilChanged()
		).subscribe(value => {
			this.valueChange.emit(value);
		});
	}

	public ngOnDestroy(): void {
		if (this.subscription) this.subscription.unsubscribe();
	}
}
