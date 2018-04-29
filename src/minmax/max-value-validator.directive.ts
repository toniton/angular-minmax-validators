import { Attribute, Directive, forwardRef, Input, OnChanges, SimpleChanges, HostBinding } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, FormControl } from '@angular/forms';

export const MAX_VALUE_VALIDATOR: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MaxValueValidator),
    multi: true
};


@Directive({
    selector: '[max],[max][ngModel]',
    providers: [MAX_VALUE_VALIDATOR]
})
export class MaxValueValidator implements Validator, OnChanges {
    @HostBinding('attr.max')
    @Input() max = '0';
    private _validator: ValidatorFn;

    static max(mx: number): ValidatorFn {
        function foo(control: AbstractControl) {
            let v = +control.value;
            return (v > mx ? { 'max': { 'maxValue': mx, 'actualValue': v } } : null);
        }
        return foo;
    }

    constructor(@Attribute('max') mx: string) {
        if (mx !== undefined && mx !== null) {
            const attrValue = parseInt(mx, 10);
            if (!isNaN(attrValue)) {
                this.max = mx;
                this._createValidator();
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const maxChange = changes['max'];
        if (maxChange) {
            this._createValidator();
        }
    }

    _createValidator() {
        this._validator = MaxValueValidator.max(parseInt(this.max, 10));
    }

    validate(c: AbstractControl): { [key: string]: any } {
        return this._validator(c);
    }
}
