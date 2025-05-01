import { Component, inject, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BotService } from '@app/services/bot/bot.service';
import { ActionService } from '@core/services/action.service';
import { ActionEnum } from '@core/enums/action.enum';
import { first } from 'rxjs';
import { BotUpdateRequestModel } from '@app/models/bot/bot-update-request.model';
import { CalculatorPresetService } from '@app/services/calculator-preset/calculator-preset.service';
import { CalculatorFormulaPresetService } from '@app/services/calculator-formula-preset/calculator-formula-preset.service';

@Component({
	selector: 'app-calculator-header-update',
	templateUrl: './calculator-header-update.component.html',
	styleUrl: './calculator-header-update.component.scss',
	standalone: true
})
export class CalculatorHeaderUpdateComponent {
	@Input() formGroup: FormGroup;
	private readonly actionService = inject(ActionService);
	private readonly botService = inject(BotService);
	private readonly calculatorPresetService = inject(CalculatorPresetService);
	private readonly calculatorFormulaPresetService = inject(CalculatorFormulaPresetService);

	public onClick(): void {
		const request: BotUpdateRequestModel = {
			calculatorPresetId: this.calculatorPresetService.models.find(x => x.selected).id,
			calculatorFormulaPresetId: this.calculatorFormulaPresetService.models.find(x => x.selected).id,
		};

		this.actionService.update({
			action: ActionEnum.calculatorStart
		});

		this.botService.update(request)
			.pipe(first())
			.subscribe();
	}
}
