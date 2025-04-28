import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-loading-spinner',
	templateUrl: './loading-spinner.component.html',
	styleUrl: './loading-spinner.component.scss',
	standalone: true
})
export class LoadingSpinnerComponent {
	@Input() size: number = 6;
	@Input() borderWidth: number = 0.3;
	@Input() borderStyle: 'dotted' | 'dashed' | 'solid' | 'double' = 'solid';
	@Input() borderColor: string = '#323a42';
}
