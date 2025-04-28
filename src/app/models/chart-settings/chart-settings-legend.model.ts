export interface ChartSettingsLegendModel {
    horizontal: ChartSettingsLegendDataModel;
    vertical: ChartSettingsLegendDataModel;
}

interface ChartSettingsLegendDataModel {
    color: string;
    background: string;
    horizontalPadding: number;
    verticalPadding: number;
}
