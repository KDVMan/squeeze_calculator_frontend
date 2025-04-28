import { booleanAttribute, Directive, ElementRef, Input } from '@angular/core';

@Directive({
	selector: '[scrollToActive]',
	standalone: true
})
export class ScrollToActiveDirective {
	constructor(private el: ElementRef<HTMLElement>) {
	}

	@Input({transform: booleanAttribute}) set scrollToActive(isActive: boolean) {
		if (isActive) {
			setTimeout(() => {
				const element = this.el.nativeElement.querySelector('.active');
				if (element) element.scrollIntoView({behavior: 'auto', block: 'nearest'});
			});
		}
	}
}
