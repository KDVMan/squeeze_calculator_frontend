import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[selectOnFocus]',
    standalone: true
})

export class SelectOnFocusDirective {
    constructor(private elementRef: ElementRef) {
    }

    @HostListener('focus') onFocus(): void {
        this.elementRef.nativeElement.select();
    }
}
