import { QuoteModel } from '@app/models/quote/quote.model';
import { Chart } from '@app/classes/chart/chart';
import { DirectionEnum } from '@core/enums/direction.enum';
import { DrawService } from '@app/classes/chart/services/draw.service';

export class InformationService {
    constructor(private chart: Chart) {
    }

    public draw(): void {
        if (this.chart.mouseService.x < 0 || this.chart.mouseService.x > this.chart.getWidth()) return;

        const time = this.chart.rangeService.x.coordinateToValue(this.chart.mouseService.x);
        const index = this.findIndex(time);

        if (index >= 0 && time >= this.chart.quotes[0].timeOpen) {
            const quote = this.chart.quotes[index];
            const direction = QuoteModel.getDirection(quote.priceOpen, quote.priceClose);

            let y = this.chart.chartSettingsModel.information.verticalPadding;

            y += this.drawPrice(quote, direction, y);
            y += this.drawVolume(quote, direction, y, index);

            // if (this.chart.strategyResult) this.drawActivator(quote, direction, y);
        }
    }

    private drawPrice(quote: QuoteModel, direction: DirectionEnum, y: number): number {
        let x = this.chart.chartSettingsModel.information.horizontalPadding;

        ['priceOpen', 'priceHigh', 'priceLow', 'priceClose'].forEach((key) => {
            const nameModel = this.chart.chartSettingsModel.information[`${key}Name`];
            const valueModel = this.chart.chartSettingsModel.information[`${key}Value`];
            const value = this.chart.textService.formatNumber(quote[key], this.chart.initModel.precision);

            x = this.drawText(
                nameModel[direction].active ? nameModel.text : null,
                valueModel[direction].active ? value.toString() : null,
                x,
                y,
                nameModel[direction].color,
                valueModel[direction].color
            );
        });

        if (x <= this.chart.chartSettingsModel.information.verticalPadding) return 0;
        return this.chart.textService.textHeight + this.chart.chartSettingsModel.information.verticalSpacing;
    }

    private drawVolume(quote: QuoteModel, direction: DirectionEnum, y: number, index: number): number {
        let x = this.chart.chartSettingsModel.information.horizontalPadding;

        ['volume', 'trades'].forEach((key) => {
            const nameModel = this.chart.chartSettingsModel.information[`${key}Name`];
            const valueModel = this.chart.chartSettingsModel.information[`${key}Value`];
            const value = this.chart.textService.formatNumber(key == 'index' ? index : quote[key == 'volume' ? 'volumeRight' : key], 0);

            x = this.drawText(
                nameModel[direction].active ? nameModel.text : null,
                valueModel[direction].active ? value.toString() : null,
                x,
                y,
                nameModel[direction].color,
                valueModel[direction].color
            );
        });

        if (x <= this.chart.chartSettingsModel.information.verticalPadding) return 0;
        return this.chart.textService.textHeight + this.chart.chartSettingsModel.information.verticalSpacing;
    }

    // private drawActivator(quote: QuoteModel, direction: DirectionEnum, y: number): void {
    // 	const nameModel = this.chart.chartSettingsModel.information['activatorName'];
    // 	const valueModel = this.chart.chartSettingsModel.information['activatorValue'];
    // 	let x = this.chart.chartSettingsModel.information.horizontalPadding;
    //
    // 	for (const strategyResult of this.chart.strategyResult) {
    // 		if (!this.chart.activators.includes(strategyResult.activatorId)) continue;
    //
    // 		if (strategyResult.activator === ActivatorEnum.position) {
    // 			y = this.drawPosition(quote, strategyResult.position, x, y);
    // 		} else {
    // 			const startTime = strategyResult.window[0].timeOpen;
    // 			const endTime = strategyResult.window[strategyResult.window.length - 1].timeOpen;
    //
    // 			if (quote.timeOpen >= startTime && quote.timeOpen <= endTime) {
    // 				const name = `активатор (${ActivatorEnum[strategyResult.activator]} - ${strategyResult.activatorId}, ${strategyResult.index - strategyResult.window.length + 1} - ${strategyResult.index})`;
    // 				let value = null;
    //
    // 				if (valueModel[direction].active) {
    // 					value = this.chart.textService.formatNumber(strategyResult.value, this.chart.settingsInit.symbol.precision);
    // 					value += ', ';
    // 					value += this.chart.textService.formatNumber(strategyResult.price, this.chart.settingsInit.symbol.precision);
    // 				}
    //
    // 				this.drawText(
    // 					nameModel[direction].active ? name : null,
    // 					value,
    // 					x,
    // 					y,
    // 					nameModel[direction].color,
    // 					valueModel[direction].color
    // 				);
    //
    // 				y += this.chart.textService.textHeight + this.chart.chartSettingsModel.information.verticalSpacing;
    // 			}
    // 		}
    // 	}
    // }

    // private drawPosition(quote: QuoteModel, position: StrategySymbolPositionModel, x: number, y: number): number {
    //     const nameModel = this.chart.chartSettingsModel.information['positionName'];
    //     const valueModel = this.chart.chartSettingsModel.information['positionValue'];
    //     const startTime = position.timeOpen;
    //     let endTime = 0;
    //
    //     if (position.status === StrategySymbolPositionEnum.closeTake || position.status === StrategySymbolPositionEnum.closeStop) endTime = position.timeClose;
    //     else endTime = startTime;
    //
    //     if (quote.timeOpen >= startTime && quote.timeOpen <= endTime) {
    //         x = this.drawText(
    //             nameModel['none'].active ? `позиция открыта (${position.indexOpen})` : null,
    //             valueModel['none'].active ? this.chart.textService.formatNumber(position.priceOpen) : null,
    //             x,
    //             y,
    //             nameModel['none'].color,
    //             valueModel['none'].color
    //         ) + this.chart.chartSettingsModel.information.horizontalSpacing;
    //
    //         if (position.priceClose) {
    //             this.drawText(
    //                 nameModel['none'].active ? `позиция закрыта (${position.indexClose})` : null,
    //                 valueModel['none'].active ? this.chart.textService.formatNumber(position.priceClose) : null,
    //                 x,
    //                 y,
    //                 nameModel['none'].color,
    //                 position.status === StrategySymbolPositionEnum.closeTake ? valueModel['up'].color : position.status === StrategySymbolPositionEnum.closeStop ? valueModel['down'].color : valueModel['none'].color
    //             );
    //         }
    //
    //         y += this.chart.textService.textHeight + this.chart.chartSettingsModel.information.verticalSpacing;
    //     }
    //
    //     return y;
    // }

    private drawText(name: string, value: string, x: number, y: number, labelColor: string, valueColor: string): number {
        let valueSize = 0;
        let active = false;

        if (name) {
            DrawService.text(this.chart.context, name, x, y, labelColor, 'left', 'top');
            x += this.chart.textService.getTextSize(name).width + this.chart.chartSettingsModel.information.nameSpacing;
            active = true;
        }

        if (value) {
            valueSize = this.chart.textService.getTextSize(value).width;
            DrawService.text(this.chart.context, value, x, y, valueColor, 'left', 'top');
            active = true;
        }

        return x + valueSize + (active ? this.chart.chartSettingsModel.information.horizontalSpacing : 0);
    }

    private findIndex(time: number): number {
        let low = 0;
        let high = this.chart.quotes.length - 1;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const midTime = this.chart.quotes[mid].timeOpen;

            if (midTime < time) {
                low = mid + 1;
            } else if (midTime > time) {
                high = mid - 1;
            } else {
                return mid;
            }
        }

        return low < this.chart.quotes.length ? low : -1;
    }
}
