import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
	selector: '[inputRestriction]',
	standalone: true
})
export class InputRestrictionDirective {
	@Input('inputRestriction') regex: RegExp;

	constructor(private readonly el: ElementRef,
				private readonly ngControl: NgControl) {
	}

	@HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
		const specialKeys = ['Backspace', 'Delete', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'Home', 'End', 'Enter'];
		const isShortcut = event.ctrlKey || event.metaKey || (event.shiftKey && ['Insert', 'Delete'].includes(event.key));

		if (isShortcut || specialKeys.includes(event.key)) return;
		if (!event.key.match(this.regex)) event.preventDefault();
	}

	@HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
		event.preventDefault();

		let pasteData = event.clipboardData.getData('text/plain');
		let validInput = Array.from(pasteData).filter(s => s.match(this.regex)).join('');

		const start = this.el.nativeElement.selectionStart;
		const end = this.el.nativeElement.selectionEnd;

		this.el.nativeElement.value = this.el.nativeElement.value.slice(0, start) + validInput + this.el.nativeElement.value.slice(end);
		this.el.nativeElement.setSelectionRange(start + validInput.length, start + validInput.length);

		if (this.ngControl && this.ngControl.control) {
			this.ngControl.control.setValue(this.el.nativeElement.value);
		}
	}
}
