import { AbstractControl, ValidatorFn } from '@angular/forms';

export function greaterThanValidator(otherControlName: string, equal: boolean = true): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (!control.parent) {
            return null;
        }

        const thisValue = Number(control.value);
        const otherValue = Number(control.parent.get(otherControlName).value);

        if (equal && thisValue >= otherValue) return null;
        else if (thisValue > otherValue) return null;

        return {
            'greaterThan': true
        };
    };
}
