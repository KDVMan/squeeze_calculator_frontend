import { Component } from '@angular/core';
import { SortDirectionEnum } from '@core/enums/sort-direction.enum';
import { CommonModule } from '@angular/common';
import { SortIconPipe } from '@core/pipes/sort-icon.pipe';
import { SymbolListSortEnum } from '@app/enums/symbol-list/symbol-list-sort.enum';
import { SymbolListService } from '@app/services/symbol-list/symbol-list.service';
import { SymbolListSenderEnum } from '@app/enums/symbol-list/symbol-list-sender.enum';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
    selector: 'app-symbol-list-sort',
    templateUrl: './symbol-list-sort.component.html',
    styleUrl: './symbol-list-sort.component.scss',
    standalone: true,
    imports: [CommonModule, SortIconPipe, SvgIconComponent]
})
export class SymbolCalculatorSortComponent {
    public sortColumn: SymbolListSortEnum = SymbolListSortEnum.volume;
    public sortDirection: SortDirectionEnum = SortDirectionEnum.desc;

    public sortFields = [
        {name: 'Пара', value: SymbolListSortEnum.symbol},
        {name: 'Объем', value: SymbolListSortEnum.volume},
        {name: 'Трейды', value: SymbolListSortEnum.trades},
        {name: 'Цена', value: SymbolListSortEnum.price},
        {name: '%', value: SymbolListSortEnum.percent}
    ];

    constructor(private readonly symbolListService: SymbolListService) {
        this.sortColumn = symbolListService.model.sortColumn;
        this.sortDirection = symbolListService.model.sortDirection;
    }

    public onSort(column: SymbolListSortEnum): void {
        if (column === this.sortColumn) {
            this.sortDirection = this.sortDirection === SortDirectionEnum.asc ? SortDirectionEnum.desc : SortDirectionEnum.asc;
        } else {
            this.sortColumn = column;
            this.sortDirection = SortDirectionEnum.asc;
        }

        this.symbolListService.update({
            sortColumn: this.sortColumn,
            sortDirection: this.sortDirection
        }, [SymbolListSenderEnum.sort]);
    }
}
