import { LineTypeEnum } from '@core/enums/line-type.enum';

export interface ChartSettingsCaptionLineModel {
    active: boolean;
    thickness: number;
    color: string;
    lineType: LineTypeEnum;
}

export interface ChartSettingsCaptionBodyModel {
    active: boolean;
    color: string;
}

export interface ChartSettingsCaptionTextModel {
    active: boolean;
    color: string;
}

