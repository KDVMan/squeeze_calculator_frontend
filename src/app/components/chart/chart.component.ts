import { Component, HostListener, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitService } from '@app/services/init/init.service';
import { LoadingSpinnerComponent } from '@core/components/loading-spinner/loading-spinner.component';
import { first, Subscription } from 'rxjs';
import { InitModel } from '@app/models/init/init.model';
import { QuoteService } from '@app/services/quote/quote.service';
import { QuoteTypeEnum } from '@app/enums/quote/quote-type.enum';
import { ChartSettingsService } from '@app/services/chart-settings/chart-settings.service';
import { QuoteRequestModel } from '@app/models/quote/quote-request.model';
import { Chart } from '@app/classes/chart/chart';
import { QuoteResponseModel } from '@app/models/quote/quote-response.model';
import { InitSenderEnum } from '@app/enums/init/init-sender.enum';
import { InitSubjectModel } from '@app/models/init/init-subject.model';
import { ChartSettingsModel } from '@app/models/chart-settings/chart-settings.model';
import { WebsocketEventEnum } from '@core/enums/websocket-event.enum';
import { WebsocketService } from '@core/services/websocket.service';
import { QuoteModel } from '@app/models/quote/quote.model';
import { ChartPanelComponent } from '@app/components/chart/chart-panel/chart-panel.component';
import { CalculateService } from '@app/services/calculate/calculate.service';

@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrl: './chart.component.scss',
	standalone: true,
	imports: [CommonModule, LoadingSpinnerComponent, ChartPanelComponent]
})
export class ChartComponent implements OnInit, OnDestroy {
	private readonly renderer = inject(Renderer2);
	private readonly initService = inject(InitService);
	private readonly chartSettingsService = inject(ChartSettingsService);
	private readonly quoteService = inject(QuoteService);
	private readonly calculateService = inject(CalculateService);
	private readonly websocketService = inject(WebsocketService);
	private subscriptionInit: Subscription;
	private subscriptionChartSettings: Subscription;
	private subscriptionCalculate: Subscription;
	private subscriptionChart: Subscription;
	private subscriptionCurrentPrice: Subscription;
	private chart: Chart;
	public loaded: boolean = false;

	public ngOnInit(): void {
		this.chart = new Chart(this.renderer.selectRootElement('canvas', true));
		this.chart.updateSettings(this.chartSettingsService.model);

		this.loadQuotes(0, QuoteTypeEnum.init);

		this.subscriptionInit = this.initService.updateSubject.subscribe((response: InitSubjectModel) => {
			if (response.senders.some(x => x === InitSenderEnum.symbol || x === InitSenderEnum.interval)) {
				this.loaded = false;
				this.loadQuotes(0, QuoteTypeEnum.init, 0, response.params?.['yRescale'] ?? true);
			}
		});

		this.subscriptionChartSettings = this.chartSettingsService.updateSubject.subscribe((response: ChartSettingsModel) => {
			this.chart.updateSettings(response, true);
		});

		this.subscriptionCalculate = this.calculateService.updateSubject.subscribe((index: number) => {
			this.loaded = false;
			this.loadQuotes(0, QuoteTypeEnum.calculate, index);
		});

		this.subscriptionChart = this.chart.loadSubject.subscribe((time: number) => {
			this.loadMoreQuotes(time);
		});

		this.subscriptionCurrentPrice = this.websocketService.receive<QuoteModel>(WebsocketEventEnum.currentPrice).subscribe((response: QuoteModel) => {
			if (this.chart && this.chart.loadQuoteService) this.chart.loadQuoteService.updateCurrent(response);
		});
	}

	public ngOnDestroy(): void {
		if (this.subscriptionInit) this.subscriptionInit.unsubscribe();
		if (this.subscriptionChartSettings) this.subscriptionChartSettings.unsubscribe();
		if (this.subscriptionCalculate) this.subscriptionCalculate.unsubscribe();
		if (this.subscriptionChart) this.subscriptionChart.unsubscribe();
		if (this.subscriptionCurrentPrice) this.subscriptionCurrentPrice.unsubscribe();
	}

	private loadQuotes(timeEnd: number, type: QuoteTypeEnum, index: number = 0, yRescale: boolean = true): void {
		const request: QuoteRequestModel = {
			symbol: this.initService.model.symbol,
			interval: InitModel.getActiveInterval(this.initService.model.intervals).name,
			quotesLimit: this.initService.model.quotesLimit,
			timeEnd: timeEnd,
			index: index,
			type: type
		};

		this.quoteService.load(request)
			.pipe(first())
			.subscribe((response: QuoteResponseModel) => {
				if (type === QuoteTypeEnum.load) {
					this.chart.loadQuoteService.update(
						response.quotes,
						timeEnd
					);
				} else {
					this.chart.init({
						initModel: this.initService.model,
						quotes: response.quotes,
						timeFrom: response.timeFrom,
						timeTo: response.timeTo,
						xRescale: true,
						yRescale: yRescale,
						// strategyResult: response.strategySymbolModel?.strategyResult ?? null,
						// activators: response.strategySymbolModel?.strategy?.activators?.filter(activator => activator.show).map(activator => activator.id) || []
					});
				}

				if (response.deals?.length) this.chart.updateDeals(response.deals);
				if (type == QuoteTypeEnum.init) this.chart.updateDeals();

				this.loaded = true;
			});
	}

	private loadMoreQuotes(time: number): void {
		this.loadQuotes(time, QuoteTypeEnum.load);
	}

	public mouseEvent(eventName: string, event: MouseEvent): void {
		if (this.loaded) this.chart.mouseEvent(eventName, event);
	}

	@HostListener('document:keydown.escape', ['$event'])
	private keyboardEvent(event: KeyboardEvent): void {
		if (this.loaded) this.chart.keyboardEvent(event);
	}
}
