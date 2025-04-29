import { AbstractControl, ValidationErrors } from '@angular/forms';

export function leastOneCheckedValidator(fieldNames: string[]) {
	return (control: AbstractControl): ValidationErrors | null => {
		const hasValue = fieldNames.some(fieldName => {
			const field = control.get(fieldName);
			return !!field?.value;
		});

		return hasValue ? null : {atLeastOneField: {fields: fieldNames}};
	};
}
