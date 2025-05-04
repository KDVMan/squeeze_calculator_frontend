import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, first, Observable, Subscription } from 'rxjs';
import { PaginationService } from '@core/services/pagination.service';
import { BotModel } from '@app/models/bot/bot.model';
import { WebsocketService } from '@core/services/websocket.service';
import { WebsocketEventEnum } from '@core/enums/websocket-event.enum';
import { BotSortEnum } from '@app/enums/bot/bot-sort.enum';
import { SortIconPipe } from '@core/pipes/sort-icon.pipe';
import { LoadingSpinnerComponent } from '@core/components/loading-spinner/loading-spinner.component';
import { InitService } from '@app/services/init/init.service';
import { SortDirectionEnum } from '@core/enums/sort-direction.enum';
import { InitSenderEnum } from '@app/enums/init/init-sender.enum';
import { SvgIconComponent } from 'angular-svg-icon';
import { InitSubjectModel } from '@app/models/init/init-subject.model';
import { TranslatePipe } from '@ngx-translate/core';
import { BotStatusEnum } from '@app/enums/bot/bot-status.enum';
import { BotService } from '@app/services/bot/bot.service';
import { BotUpdateStatusRequestModel } from '@app/models/bot/bot-update-status-request.model';
import { BotParamModel } from '@app/models/bot/bot-param.model';

@Component({
	selector: 'app-bot-list',
	templateUrl: './bot-list.component.html',
	styleUrl: './bot-list.component.scss',
	imports: [CommonModule, NgbNavModule, SortIconPipe, LoadingSpinnerComponent, SvgIconComponent, TranslatePipe, NgbTooltip]
})
export class BotListComponent implements OnInit, OnDestroy {
	private readonly initService = inject(InitService);
	private readonly paginationService = inject(PaginationService);
	private readonly websocketService = inject(WebsocketService);
	private readonly botService = inject(BotService);
	private subscriptionInit: Subscription;
	private subscriptionBotList: Subscription;
	private subscriptionBot: Subscription;
	protected total$: Observable<number>;
	protected page$: Observable<number>;
	protected loaded: boolean = true;
	public sortColumn: BotSortEnum = BotSortEnum.symbol;
	public sortDirection: SortDirectionEnum = SortDirectionEnum.desc;
	public results: BotModel[] = [];
	public toggle$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public readonly botStatusEnum = BotStatusEnum;
	public selectedBotID = 0;
	public currentSymbol: string;
	private readonly cdr = inject(ChangeDetectorRef);
	private intervalId: any;

	public sortFields = [
		{name: '#', value: BotSortEnum.id, sortable: true},
		{name: 'Символ', value: BotSortEnum.symbol, sortable: true},
		{name: 'Интервал', value: BotSortEnum.interval, sortable: true},
		{name: 'Направление', value: BotSortEnum.tradeDirection, sortable: true},
		{name: 'Окно', value: BotSortEnum.window, sortable: true},
		{name: 'Привязка', value: BotSortEnum.bind, sortable: false},
		{name: 'Вх.', value: BotSortEnum.percentIn, sortable: false},
		{name: 'Вых.', value: BotSortEnum.percentOut, sortable: false},
		{name: 'Стоп t', value: BotSortEnum.stopTime, sortable: false},
		{name: 'Стоп %', value: BotSortEnum.stopPercent, sortable: false},
		{name: 'Обновление', value: BotSortEnum.timeUpdate, sortable: false},
		{name: 'Статус', value: BotSortEnum.status, sortable: true},
	];

	public ngOnInit(): void {
		this.total$ = this.paginationService.totalSubject;
		this.page$ = this.paginationService.pageSubject;
		this.sortColumn = this.initService.model.botSortColumn;
		this.sortDirection = this.initService.model.botSortDirection;
		this.currentSymbol = this.initService.model.symbol;

		this.startTimer();

		this.subscriptionInit = this.initService.setSubject.subscribe((response: InitSubjectModel) => {
			if (response.senders.some(x => x === InitSenderEnum.symbol)) {
				this.currentSymbol = this.initService.model.symbol;
				this.loaded = false;
			}
		});

		this.subscriptionBotList = this.websocketService.receive<BotModel[]>(WebsocketEventEnum.botList).subscribe(results => {
			this.results = results;
			this.loaded = true;
		});

		this.subscriptionBot = this.websocketService.receive<BotModel>(WebsocketEventEnum.bot).subscribe(result => {
			const index = this.results.findIndex(x => x.id === result.id);

			if (index !== -1) {
				result.param = Object.assign(new BotParamModel(), result.param);
				this.results[index] = result;
			}
		});
	}

	public ngOnDestroy(): void {
		if (this.intervalId) clearInterval(this.intervalId);
		if (this.subscriptionInit) this.subscriptionInit.unsubscribe();
		if (this.subscriptionBotList) this.subscriptionBotList.unsubscribe();
		if (this.subscriptionBot) this.subscriptionBot.unsubscribe();
	}

	private startTimer(): void {
		this.intervalId = setInterval(() => {
			this.results.forEach(bot => {
				if (bot.param instanceof BotParamModel) {
					bot.param.updateTimer();
				}
			});

			this.cdr.detectChanges();
		}, 1000);
	}

	get resultsFiltered(): BotModel[] {
		return this.toggle$.value
			? this.results.filter(bot => bot.symbol === this.currentSymbol)
			: this.results;
	}

	public onPage(page: number) {
		this.paginationService.setPage(page);
	}

	public onSort(column: BotSortEnum): void {
		this.loaded = false;

		if (column === this.initService.model.botSortColumn) {
			this.sortDirection = this.sortDirection === SortDirectionEnum.asc ? SortDirectionEnum.desc : SortDirectionEnum.asc;
		} else {
			this.sortColumn = column;
			this.sortDirection = SortDirectionEnum.asc;
		}

		this.initService.update({
			botSortColumn: this.sortColumn,
			botSortDirection: this.sortDirection
		}, [InitSenderEnum.bot]);
	}

	public onStatus(id: number, event: Event, status: BotStatusEnum) {
		event.stopPropagation();

		const request: BotUpdateStatusRequestModel = {
			id: id,
			status: status
		};

		this.botService.updateStatus(request)
			.pipe(first())
			.subscribe();
	}

	public onToggle(): void {
		this.toggle$.next(!this.toggle$.value);
	}

	public onClick(bot: BotModel): void {
		this.initService.update({
			symbol: bot.symbol,
			interval: this.initService.model.intervals.find(i => i.name === bot.interval)
		}, [InitSenderEnum.symbol, InitSenderEnum.interval, InitSenderEnum.bot]);

		this.currentSymbol = bot.symbol;
	}
}
