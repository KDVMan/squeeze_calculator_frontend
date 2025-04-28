import { CursorTypeEnum } from '@core/enums/cursor-type.enum';
import { ChartSettingsCaptionBodyModel, ChartSettingsCaptionLineModel, ChartSettingsCaptionTextModel } from '@app/models/chart-settings/chart-settings-caption.model';

export interface ChartSettingsAimModel {
    cursor: CursorTypeEnum;
    line: ChartSettingsAimLineModel;
    body: ChartSettingsAimBodyModel;
    text: ChartSettingsAimTextModel;
}

interface ChartSettingsAimLineModel {
    horizontal: ChartSettingsCaptionLineModel;
    vertical: ChartSettingsCaptionLineModel;
}

interface ChartSettingsAimBodyModel {
    horizontal: ChartSettingsCaptionBodyModel;
    vertical: ChartSettingsCaptionBodyModel;
}

interface ChartSettingsAimTextModel {
    horizontal: ChartSettingsCaptionTextModel;
    vertical: ChartSettingsCaptionTextModel;
}

