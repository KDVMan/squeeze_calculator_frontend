import { Chart } from '@app/classes/chart/chart';

export class MouseService {
    private dpi = window.devicePixelRatio;
    public x: number = -1;
    public y: number = -1;
    public dragging: boolean = false;
    public updateAllow: boolean = false;

    constructor(private chart: Chart) {
        this.reset();
    }

    public eventDown(e: MouseEvent): void {
        if (this.chart.rulerService.allow && !this.chart.rulerService.fixed) {
            this.chart.rulerService.fixed = true;
            return;
        }

        if (e.shiftKey) {
            const rect = this.chart.canvas.getBoundingClientRect();

            this.chart.rulerService.xStart = (e.clientX - rect.left) * this.dpi;
            this.chart.rulerService.xEnd = this.chart.rulerService.xStart;
            this.chart.rulerService.yStart = (e.clientY - rect.top) * this.dpi;
            this.chart.rulerService.yEnd = this.chart.rulerService.yStart;
            this.chart.rulerService.allow = true;
            this.chart.rulerService.fixed = false;

            return;
        }

        this.dragging = true;
        this.chart.rulerService.allow = false;
        if (this.updateAllow) this.chart.update();
    }

    public eventUp(e: MouseEvent): void {
        this.dragging = false;
    }

    public eventMove(e: MouseEvent): void {
        const rect = this.chart.canvas.getBoundingClientRect();

        this.x = (e.clientX - rect.left) * this.dpi;
        this.y = (e.clientY - rect.top) * this.dpi;

        if (this.chart.rulerService.allow && !this.chart.rulerService.fixed) {
            this.chart.rulerService.xEnd = (e.clientX - rect.left) * this.dpi;
            this.chart.rulerService.yEnd = (e.clientY - rect.top) * this.dpi;

            if (this.updateAllow) this.chart.update();

            return;
        }

        if (this.dragging && e.buttons === 1) {
            const scaleX = this.chart.rangeService.x.range / this.chart.getWidth();
            const scaleY = this.chart.rangeService.y.range / this.chart.getHeight();

            this.chart.rangeService.x.min -= e.movementX * scaleX;
            this.chart.rangeService.x.max -= e.movementX * scaleX;
            this.chart.rangeService.x.updateRange();

            this.chart.rangeService.y.min += e.movementY * scaleY;
            this.chart.rangeService.y.max += e.movementY * scaleY;
            this.chart.rangeService.y.updateRange();
        }

        if (this.updateAllow) this.chart.update();
    }

    public eventLeave(e: MouseEvent): void {
        this.reset(true);
        this.dragging = false;
        if (this.updateAllow) this.chart.update();
    }

    public eventContextMenu(e: PointerEvent): void {
        e.preventDefault();
    }

    public eventWheel(e: WheelEvent): void {
        const speed = e.deltaY > 0 ? this.chart.chartSettingsModel.mouse.wheelSpeedDown : -this.chart.chartSettingsModel.mouse.wheelSpeedUp;
        const delta = 1 + (speed / 100);
        e.preventDefault();

        if (e.ctrlKey || e.buttons === 2) {
            this.chart.rangeService.y.scale(delta);
            this.chart.rangeService.volume.range *= delta;
            if (this.chart.rulerService.allow) this.chart.rulerService.rescaleY(delta);
        } else {
            const newDelta = this.getDelta(delta);
            this.chart.rangeService.x.scale(newDelta);
            if (this.chart.rulerService.allow) this.chart.rulerService.rescaleX(newDelta);
        }

        if (this.updateAllow) {
            this.chart.visibleCandles = this.chart.getCandlesOnScreen();
            this.chart.update();
        }
    }

    public eventDoubleClick(e: MouseEvent): void {
        let sliceStart = this.chart.quotes.findIndex(quote => this.chart.rangeService.x.coordinateBetweenMinMax(quote.timeOpen) >= 0);
        if (sliceStart < 0) sliceStart = 0;

        // const sliceEnd = sliceStart + this.chart.getCandlesOnScreen();
        const sliceEnd = sliceStart + this.chart.getVisibleCandlesOnScreen();
        const data = this.chart.quotes.slice(sliceStart, sliceEnd);

        const yMin = data.reduce((previousValue, currentValue) => previousValue > currentValue.priceLow ? currentValue.priceLow : previousValue, Number.MAX_VALUE);
        const yMax = data.reduce((previousValue, currentValue) => previousValue < currentValue.priceHigh ? currentValue.priceHigh : previousValue, Number.MIN_VALUE);

        this.chart.rangeService.y.min = yMin;
        this.chart.rangeService.y.max = yMax;
        this.chart.rangeService.y.updateRange();

        this.chart.update();
    }

    private getDelta(delta: number): number | null {
        const currentCandlesOnScreen = this.chart.getCandlesOnScreen(false);
        const newCandlesOnScreen = currentCandlesOnScreen * delta;

        if (newCandlesOnScreen < this.chart.chartSettingsModel.candle.minOnScreen) {
            return this.chart.chartSettingsModel.candle.minOnScreen / currentCandlesOnScreen;
        } else if (newCandlesOnScreen > this.chart.chartSettingsModel.candle.maxOnScreen) {
            return this.chart.chartSettingsModel.candle.maxOnScreen / currentCandlesOnScreen;
        }

        return delta;
    }

    public reset(mouseLeave: boolean = false): void {
        this.x = -1;
        this.y = -1;
        if (mouseLeave === false) this.updateAllow = false;
    }
}


