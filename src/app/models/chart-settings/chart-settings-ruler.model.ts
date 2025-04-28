import { ChartSettingsCaptionBodyModel, ChartSettingsCaptionLineModel, ChartSettingsCaptionTextModel } from '@app/models/chart-settings/chart-settings-caption.model';

export interface ChartSettingsRulerModel {
    body: ChartSettingsRulerBodyModel;
    information: ChartSettingsRulerInformationModel;
    arrow: ChartSettingsRulerArrowModel;
    caption: ChartSettingsRulerCaptionModel;
}

interface ChartSettingsRulerBodyModel {
    up: ChartSettingsRulerBodyDataModel;
    down: ChartSettingsRulerBodyDataModel;
}

interface ChartSettingsRulerBodyDataModel {
    active: boolean;
    color: string;
}

interface ChartSettingsRulerInformationModel {
    body: ChartSettingsRulerInformationBodyModel;
    text: ChartSettingsRulerInformationTextModel;
    horizontalPadding: number;
    verticalPadding: number;
    indent: number;
}

interface ChartSettingsRulerInformationBodyModel {
    up: ChartSettingsCaptionBodyModel;
    down: ChartSettingsCaptionBodyModel;
}

interface ChartSettingsRulerInformationTextModel {
    up: ChartSettingsCaptionTextModel;
    down: ChartSettingsCaptionTextModel;
}

interface ChartSettingsRulerArrowModel {
    up: ChartSettingsRulerArrowDataModel;
    down: ChartSettingsRulerArrowDataModel;
}

interface ChartSettingsRulerArrowDataModel {
    active: boolean;
    color: string;
}

interface ChartSettingsRulerCaptionModel {
    line: ChartSettingsRulerCaptionLineModel;
    body: ChartSettingsRulerCaptionBodyModel;
    text: ChartSettingsRulerCaptionTextModel;
}

interface ChartSettingsRulerCaptionLineModel {
    up: ChartSettingsRulerCaptionLineDataModel;
    down: ChartSettingsRulerCaptionLineDataModel;
}

interface ChartSettingsRulerCaptionLineDataModel {
    horizontal: ChartSettingsCaptionLineModel;
    vertical: ChartSettingsCaptionLineModel;
}

interface ChartSettingsRulerCaptionBodyModel {
    up: ChartSettingsRulerCaptionBodyDataModel;
    down: ChartSettingsRulerCaptionBodyDataModel;
}

interface ChartSettingsRulerCaptionBodyDataModel {
    right: ChartSettingsCaptionBodyModel;
    bottom: ChartSettingsCaptionBodyModel;
}

interface ChartSettingsRulerCaptionTextModel {
    up: ChartSettingsRulerCaptionTextDataModel;
    down: ChartSettingsRulerCaptionTextDataModel;
}

interface ChartSettingsRulerCaptionTextDataModel {
    right: ChartSettingsCaptionTextModel;
    bottom: ChartSettingsCaptionTextModel;
}
