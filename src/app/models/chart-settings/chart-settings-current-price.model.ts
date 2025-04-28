import { ChartSettingsCaptionBodyModel, ChartSettingsCaptionLineModel, ChartSettingsCaptionTextModel } from '@app/models/chart-settings/chart-settings-caption.model';

export interface ChartSettingsCurrentPriceModel {
    line: ChartSettingsCurrentPriceLineModel;
    body: ChartSettingsCurrentPriceBodyModel;
    text: ChartSettingsCurrentPriceTextModel;
}

interface ChartSettingsCurrentPriceLineModel {
    up: ChartSettingsCaptionLineModel;
    down: ChartSettingsCaptionLineModel;
}

interface ChartSettingsCurrentPriceBodyModel {
    up: ChartSettingsCaptionBodyModel;
    down: ChartSettingsCaptionBodyModel;
}

interface ChartSettingsCurrentPriceTextModel {
    up: ChartSettingsCaptionTextModel;
    down: ChartSettingsCaptionTextModel;
}

