import { Component, inject, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BotStartRequestModel } from '@app/models/bot/bot-start-request.model';
import { InitService } from '@app/services/init/init.service';
import { BotService } from '@app/services/bot/bot.service';
import { first } from 'rxjs';
import { ActionService } from '@core/services/action.service';
import { ActionEnum } from '@core/enums/action.enum';

@Component({
	selector: 'app-calculator-header-start-mass',
	templateUrl: './calculator-header-start-mass.component.html',
	styleUrl: './calculator-header-start-mass.component.scss',
	standalone: true
})
export class CalculatorHeaderStartMassComponent {
	@Input() formGroup: FormGroup;
	private readonly actionService = inject(ActionService);
	private readonly initService = inject(InitService);
	private readonly botService = inject(BotService);

	public onClick(): void {
		const request: BotStartRequestModel = {
			symbol: this.initService.model.symbol,
			isMass: true
		};

		this.actionService.update({
			action: ActionEnum.calculatorStart
		});

		this.botService.start(request)
			.pipe(first())
			.subscribe();
	}
}
