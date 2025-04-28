import { FigureEnum } from '@core/enums/figure.enum';
import { DirectionEnum } from '@core/enums/direction.enum';

export interface ChartSettingsFigureBorderModel {
    active: boolean;
    thickness: number;
    color: string;
}

export interface ChartSettingsFigureBodyModel {
    active: boolean;
    figure: FigureEnum;
    color: string;
    width: number;
    height: number;
    thickness: number;
    direction: DirectionEnum;
}
