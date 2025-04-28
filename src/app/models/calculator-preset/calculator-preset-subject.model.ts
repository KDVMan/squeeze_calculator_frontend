import { ParamModel } from '@core/models/param.model';
import { CalculatorPresetModel } from '@app/models/calculator-preset/calculator-preset.model';
import { CalculatorPresetSenderEnum } from '@app/enums/calculator-preset/calculator-preset-sender.enum';

export interface CalculatorPresetSubjectModel {
    models: CalculatorPresetModel[];
    senders: CalculatorPresetSenderEnum[];
    params?: ParamModel;
}
