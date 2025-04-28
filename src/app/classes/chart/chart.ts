import { QuoteModel } from '@app/models/quote/quote.model';
import { TextService } from '@app/classes/chart/services/text.service';
import { RangeService } from '@app/classes/chart/services/range.service';
import { ChartInitModel } from '@app/classes/chart/models/chart/chart-init.model';
import { GridService } from '@app/classes/chart/services/grid.service';
import { CandleService } from '@app/classes/chart/services/candle.service';
import { RangeTypeEnum } from '@app/classes/chart/enums/range-type.enum';
import { LegendService } from '@app/classes/chart/services/legend.service';
import { CaptionService } from '@app/classes/chart/services/caption.service';
import { CurrentPriceService } from '@app/classes/chart/services/current-price.service';
import { MouseService } from '@app/classes/chart/services/mouse.service';
import { AimService } from '@app/classes/chart/services/aim.service';
import { RulerService } from '@app/classes/chart/services/ruler.service';
import { InformationService } from '@app/classes/chart/services/information.service';
import { LoadQuoteService } from '@app/classes/chart/services/load-quote.service';
import { Subject } from 'rxjs';
import { ChartSettingsModel } from '@app/models/chart-settings/chart-settings.model';
import { InitModel } from '@app/models/init/init.model';
import { DrawDealService } from '@app/classes/chart/services/draw-deal.service';
import { CalculateDealModel } from '@app/models/calculate/calculate-deal.model';

export class Chart {
    public context: CanvasRenderingContext2D;
    public chartSettingsModel: ChartSettingsModel;
    public initModel: InitModel;
    public quotes: QuoteModel[];
    public textService: TextService;
    public rangeService: RangeService;
    public mouseService: MouseService;
    public loadQuoteService: LoadQuoteService;
    public gridService: GridService;
    public candleService: CandleService;
    public legendService: LegendService;
    public captionService: CaptionService;
    public currentPriceService: CurrentPriceService;
    public aimService: AimService;
    public rulerService: RulerService;
    public informationService: InformationService;
    public drawDealService: DrawDealService;
    public candleWidth: number = 0;
    public candleWidthHalf: number = 0;
    public visibleCandles: number = 0;
    public timeFrom: number = 0;
    public timeTo: number = 0;
    public loadSubject = new Subject<number>();
    public deals: CalculateDealModel[] = [];
    public currentIntervalMilliseconds: number = 0;

    constructor(public canvas: HTMLCanvasElement) {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        this.canvas.width = containerWidth * devicePixelRatio;
        this.canvas.height = containerHeight * devicePixelRatio;
        this.canvas.style.width = containerWidth + 'px';
        this.canvas.style.height = containerHeight + 'px';

        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;
        this.context.scale(devicePixelRatio, devicePixelRatio);
    }

    public updateSettings(chartSettingsModel: ChartSettingsModel, update: boolean = false): void {
        this.chartSettingsModel = chartSettingsModel;

        this.canvas.style.cursor = this.chartSettingsModel.aim.cursor;

        const style = window.getComputedStyle(this.canvas);
        this.context.font = style.font.replace(/\d+px/, this.chartSettingsModel.fontSize + 'px');

        if (update) {
            this.textService.reset();
            this.update();
        }
    }

    public init(chartInit: ChartInitModel): void {
        if (chartInit.timeFrom && chartInit.timeTo) {
            chartInit.quotes = chartInit.quotes.filter(e => e.timeOpen >= chartInit.timeFrom && e.timeOpen <= chartInit.timeTo);
        }

        if (chartInit.quotes.length <= 0) return;
        this.quotes = chartInit.quotes.sort((a, b) => (a.timeOpen < b.timeOpen) ? -1 : 1);

        this.initModel = chartInit.initModel;
        if (this.visibleCandles <= 0 || (chartInit.xRescale && chartInit.yRescale)) this.visibleCandles = this.chartSettingsModel.candle.maxOnScreen;

        this.timeFrom = chartInit.timeFrom;
        this.timeTo = chartInit.timeTo;
        this.currentIntervalMilliseconds = InitModel.getActiveInterval(this.initModel.intervals).seconds * 1000;

        // 	// this.bot = Bot.loadDefault();
        // 	// this.bot.name = data.botTemplate.bot;
        // 	// if (data.botTemplate.bot) this.bot.nameSettings = 'bot' + HelperService.firstUpper(data.botTemplate.bot);
        // 	// this.bot.timeFrom = data.botTemplate.timeFrom;
        // 	// this.bot.timeTo = data.botTemplate.timeTo;
        // 	// this.bot.type = data.botTemplate.type;

        // 	// if (data.botTemplate.bot === BotEnum.horizonBreak) {
        // 	// 	this.bot.entries = data.botTemplate.botHorizonBreakResult.entry;
        // 	// 	this.bot.position = data.botTemplate.botHorizonBreakResult.position[data.botTemplate.botHorizonBreakResult.position.length - 1];
        // 	// 	this.bot.positions = data.botTemplate.botHorizonBreakResult.position;
        // 	// 	// this.bot.positionPhantom = data.botTemplate.botHorizonBreakResult.positionPhantom;
        // 	// }

        this.textService = new TextService(this);
        if (this.rangeService === undefined) this.rangeService = new RangeService(this);
        this.mouseService = new MouseService(this);
        this.loadQuoteService = new LoadQuoteService(this);
        this.gridService = new GridService(this);
        this.candleService = new CandleService(this);
        this.legendService = new LegendService(this);
        this.captionService = new CaptionService(this);
        this.currentPriceService = new CurrentPriceService(this);
        this.aimService = new AimService(this);
        this.rulerService = new RulerService(this);
        this.informationService = new InformationService(this);
        this.drawDealService = new DrawDealService(this);

        this.calculate(chartInit.xRescale, chartInit.yRescale);
    }

    public calculate(xRescale: boolean = true, yRescale: boolean = true): void {
        if (yRescale === false) {
            this.rangeService.x.delta = InitModel.getActiveInterval(this.initModel.intervals).seconds * 1000;
            const lastQuoteTime = this.quotes[this.quotes.length - 1].timeOpen;
            const startTime = lastQuoteTime - (this.visibleCandles - 1) * this.rangeService.x.delta;
            this.quotes = this.quotes.filter(quote => quote.timeOpen >= startTime);
        }

        if (xRescale) this.rangeService.reset(RangeTypeEnum.x);
        if (yRescale) this.rangeService.reset(RangeTypeEnum.y);

        this.rangeService.reset(RangeTypeEnum.volume);
        this.mouseService.reset();

        this.rangeService.calculate(xRescale, yRescale);
        this.update();
    }

    public update(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.chartSettingsModel.backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.gridService.draw();
        this.candleService.draw();
        this.drawDealService.draw();
        this.legendService.draw();
        // // if (this.bot.type === BotTypeEnum.run) this.drawPhantom.draw();
        this.currentPriceService.draw();
        this.aimService.draw();
        if (this.rulerService.allow) this.rulerService.draw();
        this.informationService.draw();
    }

    public updateDeals(deals: CalculateDealModel[] = []): void {
        this.deals = deals;
        this.update();
    }

    public mouseEvent(eventName: string, event: MouseEvent): void {
        if (this.mouseService) {
            if (eventName === 'mousedown') this.mouseService.eventDown(event);
            else if (eventName === 'mouseup') this.mouseService.eventUp(event);
            else if (eventName === 'mousemove') this.mouseService.eventMove(event);
            else if (eventName === 'mouseleave') this.mouseService.eventLeave(event);
            else if (eventName === 'wheel') this.mouseService.eventWheel(event as WheelEvent);
            else if (eventName === 'contextmenu') this.mouseService.eventContextMenu(event as PointerEvent);
            else if (eventName === 'dblclick') this.mouseService.eventDoubleClick(event);
        }
    }

    public keyboardEvent(event: KeyboardEvent): void {
        if (this.rulerService && this.rulerService.allow) {
            this.rulerService.allow = false;
            this.update();
        }
    }

    public getCandlesOnScreen(round: boolean = true): number {
        const candles = this.rangeService.x.range / this.rangeService.x.delta;

        if (round) return Math.round(candles);
        return candles;
    }

    public getVisibleCandlesOnScreen(): number {
        return this.quotes.filter(quote => quote.timeOpen >= this.rangeService.x.min && quote.timeOpen <= this.rangeService.x.max).length;
    }

    public getWidth(full: boolean = false): number {
        if (full) return this.canvas.width;
        return this.canvas.width - this.textService.rightWidth;
    }

    public getHeight(): number {
        return this.canvas.height - this.textService.bottomHeight;
    }
}
