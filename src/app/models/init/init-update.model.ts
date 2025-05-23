import { QuoteIntervalModel } from '@app/models/quote/quote-interval.model';
import { CalculatorFieldEnum } from '@app/enums/calculator/calculator-field.enum';
import { SortDirectionEnum } from '@core/enums/sort-direction.enum';
import { ExecActiveEnum } from '@app/enums/exec/exec-active.enum';
import { BotSortEnum } from '@app/enums/bot/bot-sort.enum';

export interface InitUpdateModel {
	symbol?: string;
	interval?: QuoteIntervalModel;
	calculateSortColumn?: CalculatorFieldEnum;
	calculateSortDirection?: SortDirectionEnum;
	botSortColumn?: BotSortEnum;
	botSortDirection?: SortDirectionEnum;
	execActive?: ExecActiveEnum;
}
