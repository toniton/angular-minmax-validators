import { Attribute, Directive, forwardRef, Input, OnChanges, SimpleChanges, Provider, HostBinding } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, FormControl } from '@angular/forms';

export const MIN_VALUE_VALIDATOR: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MinValueValidator),
    multi: true
};


@Directive({
    selector: '[min],[min][ngModel]',
    providers: [MIN_VALUE_VALIDATOR]
})
export class MinValueValidator implements Validator, OnChanges {
    @HostBinding('attr.min')
    @Input() min = '0';
    private _validator: ValidatorFn;

    static min(mn: number): ValidatorFn {
        function foo(control: AbstractControl) {
            let v = +control.value;
            return (v < mn ? { 'min': { 'minValue': mn, 'actualValue': v } } : null);
        }
        return foo;
    }

    constructor(@Attribute('min') mn: string) {
        if (mn !== undefined && mn !== null) {
            const attrValue = parseInt(mn, 10);
            if (!isNaN(attrValue)) {
                this.min = mn;
                this._createValidator();
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const minChange = changes['min'];
        if (minChange) {
            this._createValidator();
        }
    }

    _createValidator() {
        this._validator = MinValueValidator.min(parseInt(this.min, 10));
    }

    validate(c: AbstractControl): { [key: string]: any } {
        return this._validator(c);
    }

}
