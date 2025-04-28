import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-calculator-header-trade',
	templateUrl: './calculator-header-trade.component.html',
	styleUrl: './calculator-header-trade.component.scss',
	standalone: true
})
export class CalculatorHeaderTradeComponent {
	@Input() formGroup: FormGroup;

	// constructor(private readonly initService: InitService,
	//             private readonly tradeService: TradeService) {
	// }

	public onClick(): void {
		// const request: TradeStartRequestModel = {
		//     symbol: this.initService.model.symbol,
		//     window: Number(this.formGroup.get('window').value),
		//     tradeDirection: this.formGroup.get('tradeDirection').value,
		//     interval: this.formGroup.get('interval').value,
		//     bind: this.formGroup.get('bind').value,
		//     percentInFrom: Number(this.formGroup.get('percentInFrom').value),
		//     percentInTo: Number(this.formGroup.get('percentInTo').value),
		//     percentInStep: Number(this.formGroup.get('percentInStep').value),
		//     percentOutFrom: Number(this.formGroup.get('percentOutFrom').value),
		//     percentOutTo: Number(this.formGroup.get('percentOutTo').value),
		//     percentOutStep: Number(this.formGroup.get('percentOutStep').value),
		//     stopTime: this.formGroup.get('stopTime').value,
		//     stopTimeFrom: Number(this.formGroup.get('stopTimeFrom').value),
		//     stopTimeTo: Number(this.formGroup.get('stopTimeTo').value),
		//     stopTimeStep: Number(this.formGroup.get('stopTimeStep').value),
		//     stopPercent: this.formGroup.get('stopPercent').value,
		//     stopPercentFrom: Number(this.formGroup.get('stopPercentFrom').value),
		//     stopPercentTo: Number(this.formGroup.get('stopPercentTo').value),
		//     stopPercentStep: Number(this.formGroup.get('stopPercentStep').value),
		//     algorithm: this.formGroup.get('algorithm').value,
		//     amount: Number(this.formGroup.get('amount').value)
		// };
		//
		// this.tradeService.start(request)
		//     .pipe(first())
		//     .subscribe();
	}
}
