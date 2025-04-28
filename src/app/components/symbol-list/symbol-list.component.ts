import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitService } from '@app/services/init/init.service';
import { combineLatest, Observable, startWith, Subscription } from 'rxjs';
import { SymbolModel } from '@app/models/symbol/symbol.model';
import { LoadingService } from '@core/services/loading.service';
import { LoadingEnum } from '@app/core/enums/loading.enum';
import { InitSubjectModel } from '@app/models/init/init-subject.model';
import { map } from 'rxjs/operators';
import { LoadingSpinnerComponent } from '@core/components/loading-spinner/loading-spinner.component';
import { SymbolListPanelComponent } from '@app/components/symbol-list/symbol-list-panel/symbol-list-panel.component';
import { SymbolListService } from '@app/services/symbol-list/symbol-list.service';
import { WebsocketService } from '@core/services/websocket.service';
import { WebsocketEventEnum } from '@core/enums/websocket-event.enum';
import { SymbolListSubjectModel } from '@app/models/symbol-list/symbol-list-subject.model';
import { SymbolListSortEnum } from '@app/enums/symbol-list/symbol-list-sort.enum';
import { SortDirectionEnum } from '@core/enums/sort-direction.enum';
import { InitSenderEnum } from '@app/enums/init/init-sender.enum';
import { FormatNumberPipe } from '@core/pipes/format-number.pipe';
import { SymbolCalculatorSortComponent } from '@app/components/symbol-list/symbol-list-sort/symbol-list-sort.component';

@Component({
    selector: 'app-symbol-list',
    templateUrl: './symbol-list.component.html',
    styleUrl: './symbol-list.component.scss',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent, SymbolListPanelComponent, FormatNumberPipe, SymbolCalculatorSortComponent]
})
export class SymbolListComponent implements OnInit, OnDestroy {
    private subscriptionDownload: Subscription;
    public symbols$: Observable<SymbolModel[]>;
    public symbolActive: string;
    public loaded = true;

    constructor(private readonly loadingService: LoadingService,
                private readonly initService: InitService,
                private readonly symbolListService: SymbolListService,
                private readonly websocketService: WebsocketService) {
    }

    public ngOnInit(): void {
        this.subscriptionDownload = this.loadingService.subject.subscribe(result => {
            if (result.name === LoadingEnum.symbolDownload) this.loaded = !result.loading;
        });

        this.symbols$ = combineLatest([
            this.initService.updateSubject.pipe(startWith({model: this.initService.model})),
            this.symbolListService.updateSubject.pipe(startWith({model: this.symbolListService.model})),
            this.websocketService.receive<SymbolModel[]>(WebsocketEventEnum.symbolList)
        ]).pipe(
            map(([initSubjectModel, symbolListSubjectModel, symbols]: [InitSubjectModel, SymbolListSubjectModel, SymbolModel[]]) => {
                this.symbolActive = initSubjectModel.model.symbol;
                const group = symbolListSubjectModel.model.group;
                const volume = symbolListSubjectModel.model.volume;
                const sortColumn = symbolListSubjectModel.model.sortColumn;
                const sortDirection = symbolListSubjectModel.model.sortDirection;

                return symbols
                    .filter(x => (group == '' || x.group === group) && x.statistic.volume >= volume)
                    .sort((a, b) => {
                        if (sortColumn === SymbolListSortEnum.price) {
                            return sortDirection === SortDirectionEnum.asc ? a.statistic.price - b.statistic.price : b.statistic.price - a.statistic.price;
                        } else if (sortColumn === SymbolListSortEnum.volume) {
                            return sortDirection === SortDirectionEnum.asc ? a.statistic.volume - b.statistic.volume : b.statistic.volume - a.statistic.volume;
                        } else if (sortColumn === SymbolListSortEnum.trades) {
                            return sortDirection === SortDirectionEnum.asc ? a.statistic.trades - b.statistic.trades : b.statistic.trades - a.statistic.trades;
                        } else if (sortColumn === SymbolListSortEnum.percent) {
                            return sortDirection === SortDirectionEnum.asc ? a.statistic.pricePercent - b.statistic.pricePercent : b.statistic.pricePercent - a.statistic.pricePercent;
                        }

                        return sortDirection === SortDirectionEnum.asc ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
                    });
            })
        );
    }

    public ngOnDestroy(): void {
        if (this.subscriptionDownload) this.subscriptionDownload.unsubscribe();
    }

    public onClick(symbol: string) {
        this.initService.update({
            symbol: symbol
        }, [InitSenderEnum.symbol]);
    }

    public trackBySymbol(index: number, symbol: SymbolModel): string {
        return symbol.symbol;
    }
}
