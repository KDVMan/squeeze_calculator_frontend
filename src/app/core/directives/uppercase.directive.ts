import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
	selector: '[uppercase]',
	standalone: true
})
export class UppercaseDirective {
	private readonly el = inject(ElementRef<HTMLInputElement>);

	@HostListener('input')
	onInput(): void {
		const input = this.el.nativeElement;
		const start = input.selectionStart;
		const end = input.selectionEnd;

		input.value = input.value.toUpperCase();
		input.setSelectionRange(start, end); // восстановление позицию курсора
	}
}
