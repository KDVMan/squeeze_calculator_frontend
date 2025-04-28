import { SortDirectionEnum } from '@core/enums/sort-direction.enum';
import { SymbolListSortEnum } from '@app/enums/symbol-list/symbol-list-sort.enum';

export interface SymbolListUpdateModel {
    group?: string;
    volume?: number;
    sortColumn?: SymbolListSortEnum;
    sortDirection?: SortDirectionEnum;
}
