export class CalculatorPresetAddRequestModel {
    name: string;
}

export class CalculatorPresetEditRequestModel {
    id: number;
    name: string;
}

export class CalculatorPresetDuplicateRequestModel {
    id: number;
}

export interface CalculatorPresetDeleteRequestModel {
    id: number;
}
