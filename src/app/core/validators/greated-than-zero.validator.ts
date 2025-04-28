import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function greaterThanZeroValidator(equal: boolean = true): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = Number(control.value);

        if (equal && value >= 0) {
            return null;
        } else if (!equal && value > 0) {
            return null;
        }

        return {
            greaterThanZero: true
        };
    };
}
