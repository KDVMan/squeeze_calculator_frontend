export interface ChartSettingsCandleModel {
    minOnScreen: number;
    maxOnScreen: number;
    gapSize: number;
    stick: ChartSettingsCandleStickModel;
    border: ChartSettingsCandleBorderModel;
    body: ChartSettingsCandleBodyModel;
}

interface ChartSettingsCandleStickModel {
    up: ChartSettingsCandleStickDataModel;
    down: ChartSettingsCandleStickDataModel;
}

interface ChartSettingsCandleStickDataModel {
    active: boolean;
    thickness: number;
    color: string;
}

interface ChartSettingsCandleBorderModel {
    up: ChartSettingsCandleBorderDataModel;
    down: ChartSettingsCandleBorderDataModel;
}

interface ChartSettingsCandleBorderDataModel {
    active: boolean;
    thickness: number;
    color: string;
    minWidth: number;
}

interface ChartSettingsCandleBodyModel {
    up: ChartSettingsCandleBodyDataModel;
    down: ChartSettingsCandleBodyDataModel;
}

interface ChartSettingsCandleBodyDataModel {
    active: boolean;
    color: string;
    minWidth: number;
}
