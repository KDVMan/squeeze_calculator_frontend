import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'formatNumber',
	standalone: true
})
export class FormatNumberPipe implements PipeTransform {
	transform(value: number, precision: number = 8, useSpace: boolean = true): string {
		if (value == null) return '-';

		let formattedValue = value.toFixed(precision);

		if (precision === 0) {
			formattedValue = formattedValue.split('.')[0];
		} else {
			formattedValue = formattedValue.replace(/0+$/, '').replace(/\.$/, '');
		}

		if (!formattedValue || formattedValue === '-') {
			formattedValue = '0';
		}

		const separator = useSpace ? ' ' : '';

		if (formattedValue.includes('.')) {
			const parts = formattedValue.split('.');
			formattedValue = parseInt(parts[0]).toLocaleString().replace(/,/g, separator) + '.' + parts[1];
		} else {
			formattedValue = parseInt(formattedValue).toLocaleString().replace(/,/g, separator);
		}

		return formattedValue;
	}
}
