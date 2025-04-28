import { ParamModel } from '@core/models/param.model';
import { InitSenderEnum } from '@app/enums/init/init-sender.enum';
import { InitModel } from '@app/models/init/init.model';

export interface InitSubjectModel {
    model: InitModel;
    senders: InitSenderEnum[];
    params?: ParamModel;
}
