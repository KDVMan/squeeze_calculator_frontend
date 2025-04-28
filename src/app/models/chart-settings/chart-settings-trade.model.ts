import { ChartSettingsFigureBodyModel, ChartSettingsFigureBorderModel } from '@app/models/chart-settings/chart-settings-figure.model';

export interface ChartSettingsTradeModel {
    body: ChartSettingsTradeBodyModel;
    border: ChartSettingsTradeBorderModel;
}

interface ChartSettingsTradeBodyModel {
    long: ChartSettingsTradeBodyDataModel;
    short: ChartSettingsTradeBodyDataModel;
}

interface ChartSettingsTradeBodyDataModel {
    open: ChartSettingsFigureBodyModel;
    close: ChartSettingsFigureBodyModel;
    stop: ChartSettingsFigureBodyModel;
}

interface ChartSettingsTradeBorderModel {
    long: ChartSettingsTradeBorderDataModel;
    short: ChartSettingsTradeBorderDataModel;
}

interface ChartSettingsTradeBorderDataModel {
    open: ChartSettingsFigureBorderModel;
    close: ChartSettingsFigureBorderModel;
    stop: ChartSettingsFigureBorderModel;
}
