import {
    Attribute, Directive, forwardRef, Input, OnChanges, SimpleChanges,
    HostListener, ElementRef, Renderer2, HostBinding
} from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, FormControl } from '@angular/forms';


export const NUMBERS_ONLY_VALIDATOR: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => NumbersOnlyValidator),
    multi: true
};

@Directive({
    selector: '[numbersOnly]',
    providers: [NUMBERS_ONLY_VALIDATOR]
})
export class NumbersOnlyValidator implements Validator, OnChanges {
    private _validator: ValidatorFn;
    @HostBinding('value')
    inputValue = '';
    @HostBinding('attr.numbersOnly') numbersOnly = true;

    static numbersOnly(numbers: any): ValidatorFn {
        function foo(control: AbstractControl) {
            this.inputValue = this.sanitizeNumbers(control.value);
            return null;
        }
        return foo;
    }

    @HostListener('keypress', ['$event'])
    onKeyDown(e: KeyboardEvent): boolean {
        if (e.which < 48 || e.which > 57) {
            e.preventDefault();
            e.stopPropagation();
        }
        return e.charCode >= 48 && e.charCode <= 57;
    }

    @HostListener('paste', ['$event'])
    onPaste(e: ClipboardEvent): boolean {
        e.preventDefault();
        e.stopPropagation();
        let pasteItem = e.clipboardData.getData('Text');
        this.inputValue = this.sanitizeNumbers(pasteItem);
        return;
    }

    sanitizeNumbers(text: any): string {
        if (text !== null && text !== undefined) {
            return text.replace(new RegExp(/\D/g), '');
        }
        return '';
    }

    constructor(private el: ElementRef, renderer: Renderer2, @Attribute('value') defaultValue: string) {
        this._createValidator();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const numbersOnlyChange = changes['numbersOnly'];
        if (numbersOnlyChange) {
            this._createValidator();
        }
    }

    private _createValidator() {
        this._validator = NumbersOnlyValidator.numbersOnly(this.inputValue);
    }

    validate(c: AbstractControl): { [key: string]: any; } {
        return this._validator(c);
    }

    registerOnValidatorChange?(fn: () => void): void {
        this._createValidator();
    }
}
