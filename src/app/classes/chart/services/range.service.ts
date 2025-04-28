import { Chart } from '@app/classes/chart/chart';
import { XModel } from '@app/classes/chart/models/range/x.model';
import { YModel } from '@app/classes/chart/models/range/y.model';
import { VolumeModel } from '@app/classes/chart/models/range/volume.model';
import { RangeTypeEnum } from '@app/classes/chart/enums/range-type.enum';
import { InitModel } from '@app/models/init/init.model';

export class RangeService {
    public width: number;
    public height: number;
    public x: XModel;
    public y: YModel;
    public volume: VolumeModel;

    constructor(private chart: Chart) {
        this.reset();
    }

    calculate(xRescale: boolean = true, yRescale: boolean = true): void {
        this.chart.quotes.forEach((quote) => {
            if (xRescale) {
                this.x.min = Math.min(this.x.min, quote.timeOpen);
                this.x.max = Math.max(this.x.max, quote.timeOpen);
            }

            if (yRescale) {
                this.y.min = Math.min(this.y.min, quote.priceLow);
                this.y.max = Math.max(this.y.max, quote.priceHigh);
            }

            this.volume.min = Math.min(this.volume.min, quote.volumeRight);
            this.volume.max = Math.max(this.volume.max, quote.volumeRight);
        });

        if (xRescale) {
            this.x.delta = InitModel.getActiveInterval(this.chart.initModel.intervals).seconds * 1000;
            this.x.min -= this.x.delta / 2;
            this.x.max += this.x.delta / 2;
            this.x.updateRange();
        }

        if (yRescale) {
            this.y.updateRange();
        }

        this.volume.updateRange();
        this.chart.mouseService.updateAllow = true;
    }

    public reset(type: RangeTypeEnum = RangeTypeEnum.none): void {
        this.width = this.chart.getWidth();
        this.height = this.chart.getHeight();

        if (type === RangeTypeEnum.none || type === RangeTypeEnum.x) {
            this.x = new XModel(this.width);
        }

        if (type === RangeTypeEnum.none || type === RangeTypeEnum.y) {
            this.y = new YModel(this.height);
        }

        if (type === RangeTypeEnum.none || type === RangeTypeEnum.volume) {
            this.volume = new VolumeModel();
        }
    }
}
