import { Attribute, Directive, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, FormControl } from '@angular/forms';
// import { isPresent } from '@angular/forms/src/facade/lang';


export const MAX_VALUE_VALIDATOR: any = {
	provide: NG_VALIDATORS,
	useExisting: forwardRef(() => MaxValueValidator),
	multi: true
};

@Directive({
	selector: '[max][formControlName],[min][formControl],[min][ngModel]',
	providers: [MAX_VALUE_VALIDATOR]
})

export class MaxValueValidator implements Validator, OnChanges {
	private _validator:ValidatorFn;

	@Input() max:string;

	constructor(@Attribute('max') mx:string) {
//		if (isPresent(mx)) {
			const attrValue = parseInt(mx, 10);
			if (!isNaN(attrValue)) {
				this.max = mx;
				this._createValidator();
			}
//		}
	}

	ngOnChanges(changes:SimpleChanges) {
		const maxChange = changes['max'];
		if (maxChange) {
			this._createValidator();
		}
	}

	private _createValidator() {
		this._validator = MaxValueValidator.max(parseInt(this.max, 10));
	}

	validate(c:AbstractControl) : {[key: string]: any} { return this._validator(c); }

	static max(mx:number) : ValidatorFn {
		return (control: AbstractControl): {[key: string]: any} => {
			let v = +control.value;
//			return (v > mx ? { 'max' : { 'valid' : false } } : null);
			return (v > mx ? { 'max' : { 'maxValue' : mx, 'actualValue' : v }} : null);
		};
	}
}