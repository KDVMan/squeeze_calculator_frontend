import { ParamModel } from '@core/models/param.model';
import { SymbolListModel } from '@app/models/symbol-list/symbol-list.model';
import { SymbolListSenderEnum } from '@app/enums/symbol-list/symbol-list-sender.enum';

export interface SymbolListSubjectModel {
    model: SymbolListModel;
    senders: SymbolListSenderEnum[];
    params?: ParamModel;
}
