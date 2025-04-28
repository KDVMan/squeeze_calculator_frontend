import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const date = control.value;

		if (date && Array.isArray(date) && date.length === 2 && date[0] !== null && date[1] !== null) {
			return null;
		} else {
			return {
				dateRangeFieldInvalid: true
			};
		}
	};
}