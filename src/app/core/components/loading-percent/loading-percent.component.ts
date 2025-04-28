import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
	selector: 'app-loading-percent',
	templateUrl: './loading-percent.component.html',
	styleUrl: './loading-percent.component.scss',
	standalone: true,
	imports: [
		NgIf
	]
})
export class LoadingPercentComponent implements OnInit, OnChanges {
	@Input() value: number = 0;
	@Input() valueMax: number = 0;
	@Input() size: number = 8;
	@Input() inThickness: number = 0.5;
	@Input() inBorderColor: string = '#323a42';
	@Input() inBackgroundColor: string = 'transparent';
	@Input() outThickness: number = 4;
	@Input() outBorderColor: string = '#323a42';
	@Input() outBackgroundColor: string = '#fff';
	@Input() text: string = null;
	@Input() textColor: string = '#323a42';
	@Input() textWeight: 'normal' | 'bold' = 'normal';
	@Input() textPercent: boolean = true;
	@Input() failed: boolean = false;
	@Input() failedInBackgroundColor: string = '#fff';
	@Input() failedOutBorderColor: string = '#ff524f';
	@Input() failedOutBackgroundColor: string = 'transparent';
	@Input() failedTextColor: string = '#ff524f';
	public radius: number = 50 - this.outThickness;
	public strokeDash: number = Math.PI * this.radius * 2;
	public strokeDashoffset: number = 0;
	private percent: number = 0;
	public textFormat: string = '';

	public ngOnInit(): void {
		this.updateText();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['value']) {
			if (this.valueMax > 0) {
				this.percent = Math.round(this.value * 100 / this.valueMax);
				this.updateText();
			}

			this.strokeDashoffset = this.strokeDash - (this.percent / 100) * this.strokeDash;
		}
	}

	private updateText(): void {
		if (this.failed) {
			this.textFormat = 'Ошибка';
			this.inBackgroundColor = this.failedInBackgroundColor;
			this.outBorderColor = this.failedOutBorderColor;
			this.outBackgroundColor = this.failedOutBackgroundColor;
			this.textColor = this.failedTextColor;
		} else {
			this.textFormat = this.percent.toString();
			if (this.textPercent) this.textFormat += '%';
		}
	}
}
