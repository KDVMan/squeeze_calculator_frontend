export interface ChartSettingsInformationModel {
    priceOpenName: ChartSettingsInformationDataModel;
    priceOpenValue: ChartSettingsInformationDataModel;
    priceHighName: ChartSettingsInformationDataModel;
    priceHighValue: ChartSettingsInformationDataModel;
    priceLowName: ChartSettingsInformationDataModel;
    priceLowValue: ChartSettingsInformationDataModel;
    priceCloseName: ChartSettingsInformationDataModel;
    priceCloseValue: ChartSettingsInformationDataModel;
    volumeName: ChartSettingsInformationDataModel;
    volumeValue: ChartSettingsInformationDataModel;
    tradesName: ChartSettingsInformationDataModel;
    tradesValue: ChartSettingsInformationDataModel;
    indexName: ChartSettingsInformationDataModel;
    indexValue: ChartSettingsInformationDataModel;
    activatorName: ChartSettingsInformationDataModel;
    activatorValue: ChartSettingsInformationDataModel;
    positionName: ChartSettingsInformationDataModel;
    positionValue: ChartSettingsInformationDataModel;
    horizontalPadding: number;
    verticalPadding: number;
    horizontalSpacing: number;
    verticalSpacing: number;
    nameSpacing: number;
}

export interface ChartSettingsInformationDataModel {
    text: string;
    none: ChartSettingsInformationTextModel;
    up: ChartSettingsInformationTextModel;
    down: ChartSettingsInformationTextModel;
}

export interface ChartSettingsInformationTextModel {
    active: boolean;
    color: string;
}
