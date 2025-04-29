export class CalculatorFormulaPresetAddRequestModel {
	name: string;
}

export class CalculatorFormulaPresetEditRequestModel {
	id: number;
	name: string;
}

export class CalculatorFormulaPresetDuplicateRequestModel {
	id: number;
}

export interface CalculatorFormulaPresetDeleteRequestModel {
	id: number;
}
