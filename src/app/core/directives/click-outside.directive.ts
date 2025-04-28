import { Directive, ElementRef, EventEmitter, HostListener, inject, Output } from '@angular/core';

@Directive({
	selector: '[click-outside]'
})
export class ClickOutsideDirective {
	@Output() clickOutside = new EventEmitter<MouseEvent>();
	private readonly el = inject(ElementRef<HTMLElement>);

	@HostListener('document:mousedown', ['$event'])
	onClick(event: MouseEvent): void {
		const target = event.target as Node;

		if (!this.el.nativeElement.contains(target)) {
			this.clickOutside.emit(event);
		}
	}
}
