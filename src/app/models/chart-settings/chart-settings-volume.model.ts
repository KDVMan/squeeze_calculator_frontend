export interface ChartSettingsVolumeModel {
    minLevelPercent: number;
    maxLevelPercent: number;
    border: ChartSettingsVolumeBorderModel;
    body: ChartSettingsVolumeBodyModel;
}

interface ChartSettingsVolumeBorderModel {
    up: ChartSettingsVolumeBorderDataModel;
    down: ChartSettingsVolumeBorderDataModel;
}

interface ChartSettingsVolumeBorderDataModel {
    active: boolean;
    thickness: number;
    color: string;
}

interface ChartSettingsVolumeBodyModel {
    up: ChartSettingsVolumeBodyDataModel;
    down: ChartSettingsVolumeBodyDataModel;
}

interface ChartSettingsVolumeBodyDataModel {
    active: boolean;
    color: string;
}
