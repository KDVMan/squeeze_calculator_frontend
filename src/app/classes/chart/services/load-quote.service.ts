import { QuoteModel } from '@app/models/quote/quote.model';
import { Chart } from '@app/classes/chart/chart';

export class LoadQuoteService {
    private timeStart: number;
    private timeLimit: number;
    private delta: number;
    private loading: boolean = false;

    constructor(private chart: Chart) {
    }

    public load(): void {
        if (this.loading) return;
        this.loading = true;

        // this.chart.loadSubject.next(this.chart.quotes[0].timeOpen);

        this.timeStart = this.chart.quotes[0].timeOpen;
        const timeEnd = this.timeStart - this.chart.rangeService.x.delta;
        this.delta = Math.round(this.chart.rangeService.x.delta * this.chart.initModel.quotesLimit);
        let limit = this.chart.initModel.quotesLimit;

        if (timeEnd - this.delta - this.timeStart > this.chart.gridService.second) {
            this.loading = false;
            return;
        }

        if (this.timeLimit && this.timeLimit - this.timeStart >= -this.chart.gridService.second) {
            this.loading = false;
            return;
        }

        let checkLimit = timeEnd - this.chart.timeFrom;
        checkLimit = checkLimit / this.chart.rangeService.x.delta;
        checkLimit = parseInt(checkLimit.toString());

        if (checkLimit < 0 && Math.abs(checkLimit) >= this.chart.initModel.quotesLimit) {
            this.loading = false;
            return;
        }

        if (checkLimit < 0 && Math.abs(checkLimit) < this.chart.initModel.quotesLimit) limit -= Math.abs(checkLimit);
        else if (checkLimit > 0 && checkLimit <= this.chart.initModel.quotesLimit) limit = checkLimit + 1;
        else if (checkLimit === 0) limit = checkLimit;

        if (limit > 0) {
            this.chart.loadSubject.next(timeEnd);
        } else {
            this.loading = false;
        }
    }

    public update(quotes: QuoteModel[], timeEnd: number): void {
        if (quotes == null || quotes.length === 0) return;
        
        if (this.chart.timeFrom && this.chart.timeTo) quotes = quotes.filter(e => e.timeOpen >= this.chart.timeFrom && e.timeOpen <= this.chart.timeTo);
        quotes = quotes.sort((a, b) => (a.timeOpen < b.timeOpen) ? -1 : 1);

        const checkTime = this.chart.quotes[0].timeOpen - this.chart.rangeService.x.delta;
        const index = quotes.findIndex(e => e.timeOpen >= checkTime);

        if (index > 0) {
            quotes = quotes.slice(0, index + 1);
        } else {
            if (timeEnd - this.delta >= this.timeStart) {
                this.loading = false;
                return;
            }

            this.timeLimit = this.chart.quotes[0].timeOpen;
            this.loading = false;

            return;
        }

        let newQuotes = quotes.concat(this.chart.quotes);
        this.chart.quotes = newQuotes.sort((a, b) => a.timeOpen < b.timeOpen ? -1 : 1);

        this.chart.update();
        this.loading = false;
    }

    public updateCurrent(quote: QuoteModel): void {
        if (this.chart.timeFrom && this.chart.timeTo && this.chart.quotes[this.chart.quotes.length - 1].timeClose > this.chart.timeTo) return;

        let newQuotes = this.chart.quotes;

        if (quote.timeOpen > newQuotes[newQuotes.length - 1].timeClose) {
            newQuotes.push(quote);
        } else {
            newQuotes[newQuotes.length - 1] = quote;
        }

        this.chart.quotes = newQuotes;
        this.chart.update();
    }
}
