import { Directive, ElementRef, HostListener, Input, } from '@angular/core';

@Directive({
    selector: '[numberOnly]',
    standalone: true
})
export class NumberOnlyDirective {
    @Input('allow-sign') allowSign: boolean = true;
    @Input('allow-decimal') allowDecimal: boolean = true;
    @Input('decimal-separator') decimalSeparator: string = '.';
    @Input('max-length') maxLength: number;
    @Input('max-decimal-length') maxDecimalLength: number;

    constructor(private el: ElementRef) {
    }

    @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent): void {
        let value = event.clipboardData.getData('text/plain');
        value = value.replace(/-/g, '');

        if (!String(value).match(this.getRegexp())) event.preventDefault();
        if (this.maxLength && value.length > this.maxLength) event.preventDefault();
    }

    @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
        const el = this.el.nativeElement;
        const currentValue: string = el.value;
        const isAllSelected = el.selectionStart === 0 && el.selectionEnd === el.value.length;
        const cursorPosition: number = event.target['selectionStart'];
        const signExists = currentValue.includes('-');
        const firstCharacterNotSeparator = (currentValue.charAt(0) !== this.decimalSeparator);
        const separatorExists = currentValue.includes(this.decimalSeparator);
        const separatorIsCloseToSign = (signExists && cursorPosition <= 1);
        const allowedKeys = ['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Escape', 'Tab'];

        if (event.key === '-' && this.allowSign && (isAllSelected || (!signExists && firstCharacterNotSeparator && cursorPosition === 0))) {
            event.preventDefault();
            el.value = '-';
            return;
        }

        if (event.key === this.decimalSeparator && this.allowDecimal && (isAllSelected || (!separatorExists && cursorPosition === 0))) {
            event.preventDefault();
            el.value = isAllSelected ? `0${this.decimalSeparator}` : currentValue;
            return;
        }

        if (event.key === '0' && currentValue === '-' && !separatorExists) {
            event.preventDefault();
            el.value = '-0';
            return;
        }

        if (event.key === '0' && currentValue.match(/^-?0+$/) && !separatorExists) {
            event.preventDefault();
            return;
        }

        if (event.key === '.' && currentValue == '-0' && !separatorExists) {
            event.preventDefault();
            el.value = '-0.';
            return;
        }

        if (event.key === '.' && !separatorExists) {
            event.preventDefault();
            el.value = currentValue + '.';
            return;
        }

        if (this.allowSign && !signExists && firstCharacterNotSeparator && cursorPosition === 0) allowedKeys.push('-');
        if (this.allowDecimal && !separatorIsCloseToSign && !separatorExists) allowedKeys.push(this.decimalSeparator);
        if (this.checkAllowedKey(allowedKeys, event)) return;
        if (!String(currentValue.concat(event.key)).match(this.getRegexp())) event.preventDefault();
        if (this.checkLength(currentValue.concat(event.key))) event.preventDefault();
    }

    private getRegexp(): string {
        if (this.allowSign && this.allowDecimal) return '^-?[0-9]+(.[0-9]+)?$';
        else if (!this.allowSign && this.allowDecimal) return '^[0-9]+(.[0-9]+)?$';
        else if (this.allowSign && !this.allowDecimal) return '^-?[0-9]*$';
        return '^[0-9]*$';
    }

    private checkAllowedKey(allowedKeys: string[], event: KeyboardEvent): boolean {
        const keyControl = (event.ctrlKey === true || event.metaKey === true);
        const keyShift = (event.shiftKey === true);

        if (allowedKeys.indexOf(event.key) !== -1) return true;
        if (keyControl && event.key === 'a') return true;
        if (keyControl && event.key === 'c') return true;
        if (keyControl && event.key === 'v') return true;
        if (keyControl && event.key === 'x') return true;
        if (keyControl && event.key === 'Insert') return true;
        if (keyShift && event.key === 'Insert') return true;

        return false;
    }

    private checkLength(value: string): boolean {
        value = value.replace(/-/g, '');

        if (this.el.nativeElement.selectionStart - this.el.nativeElement.selectionEnd < 0) return false;

        if (this.allowDecimal) {
            const result = value.split('.');
            if (this.maxLength > 0 && result[0] && result[0].length > this.maxLength) return true;
            if (this.maxDecimalLength > 0 && result[1] && result[1].length > this.maxDecimalLength) return true;
        } else {
            value = value.replace(/\./g, '');
            if (this.maxLength > 0 && value.length > this.maxLength) return true;
        }

        return false;
    }
}
