import { ChartSettingsInformationModel } from '@app/models/chart-settings/chart-settings-information.model';
import { ChartSettingsMouseModel } from '@app/models/chart-settings/chart-settings-mouse.model';
import { ChartSettingsGridModel } from '@app/models/chart-settings/chart-settings-grid.model';
import { ChartSettingsCandleModel } from '@app/models/chart-settings/chart-settings-candle.model';
import { ChartSettingsVolumeModel } from '@app/models/chart-settings/chart-settings-volume.model';
import { ChartSettingsLegendModel } from '@app/models/chart-settings/chart-settings-legend.model';
import { ChartSettingsCurrentPriceModel } from '@app/models/chart-settings/chart-settings-current-price.model';
import { ChartSettingsAimModel } from '@app/models/chart-settings/chart-settings-aim.model';
import { ChartSettingsRulerModel } from '@app/models/chart-settings/chart-settings-ruler.model';
import { ChartSettingsTradeModel } from '@app/models/chart-settings/chart-settings-trade.model';

export interface ChartSettingsModel {
    fontSize: number;
    backgroundColor: string;
    mouse: ChartSettingsMouseModel;
    grid: ChartSettingsGridModel;
    candle: ChartSettingsCandleModel;
    volume: ChartSettingsVolumeModel;
    legend: ChartSettingsLegendModel;
    currentPrice: ChartSettingsCurrentPriceModel;
    aim: ChartSettingsAimModel;
    ruler: ChartSettingsRulerModel;
    information: ChartSettingsInformationModel;
    trade: ChartSettingsTradeModel;
}
