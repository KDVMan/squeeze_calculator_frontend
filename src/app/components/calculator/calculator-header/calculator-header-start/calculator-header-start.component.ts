import { Component, inject, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BotStartRequestModel } from '@app/models/bot/bot-start-request.model';
import { InitService } from '@app/services/init/init.service';
import { BotService } from '@app/services/bot/bot.service';
import { first } from 'rxjs';

@Component({
	selector: 'app-calculator-header-start',
	templateUrl: './calculator-header-start.component.html',
	styleUrl: './calculator-header-start.component.scss',
	standalone: true
})
export class CalculatorHeaderStartComponent {
	@Input() formGroup: FormGroup;
	private readonly initService = inject(InitService);
	private readonly botService = inject(BotService);

	public onClick(): void {
		const request: BotStartRequestModel = {
			symbol: this.initService.model.symbol,
		};

		this.botService.start(request)
			.pipe(first())
			.subscribe();
	}
}
