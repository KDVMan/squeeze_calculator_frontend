import { Pipe, PipeTransform } from '@angular/core';
import { SortDirectionEnum } from '@core/enums/sort-direction.enum';

@Pipe({
	name: 'sortIcon',
	standalone: true
})
export class SortIconPipe implements PipeTransform {
	transform(column: string, sortColumn: string, sortDirection: SortDirectionEnum): { name: string, color: string, size: number } {
		let name = 'sort';
		let color = '#dddddd';
		let size = 0.4;

		if (column === sortColumn) {
			name = sortDirection === SortDirectionEnum.asc ? 'sort-up' : 'sort-down';
			color = '#000000';
			size = 0.4;
		}

		return {
			name: name,
			color: color,
			size: size
		};
	}
}
