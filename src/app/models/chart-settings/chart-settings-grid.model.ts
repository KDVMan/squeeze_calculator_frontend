import { LineTypeEnum } from '@core/enums/line-type.enum';

export interface ChartSettingsGridModel {
    horizontal: ChartSettingsGridDataModel;
    vertical: ChartSettingsGridDataModel;
}

interface ChartSettingsGridDataModel {
    active: boolean;
    thickness: number;
    color: string;
    lineType: LineTypeEnum;
}
