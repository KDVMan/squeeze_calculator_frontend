import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[zeroNumber]',
    standalone: true
})
export class ZeroNumberDirective {
    constructor(public ref: ElementRef,
                private ngControl: NgControl) {
    }

    @HostListener('input', ['$event']) onInput(event: { target: { value: string; }; }): void {
        if (/^0[0-9]+/.test(event.target.value)) event.target.value = event.target.value.replace(/^0+/, '');
        if (event.target.value === '') event.target.value = '0';

        this.ref.nativeElement.value = event.target.value;

        if (this.ngControl && this.ngControl.control) {
            this.ngControl.control.setValue(event.target.value, {emitEvent: false});
        }
    }

    // @HostListener('input', ['$event']) onInput(event: { target: { value: string; }; }): void {
    //     const value = event.target.value;
    //     if (value === '-0') return;
    //
    //     if (/^0[0-9]+/.test(value)) event.target.value = value.replace(/^0+/, '');
    //     if (value === '') event.target.value = '0';
    //
    //     this.ref.nativeElement.value = event.target.value;
    // }
}
