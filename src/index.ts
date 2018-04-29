import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinValueValidator } from './minmax/min-value-validator.directive';
import { MaxValueValidator } from './minmax/max-value-validator.directive';
import { NumbersOnlyValidator } from './utility/numbers-only-validator.directive';

export * from './minmax/min-value-validator.directive';
export * from './minmax/max-value-validator.directive';
export * from './utility/numbers-only-validator.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MinValueValidator,
    MaxValueValidator,
    NumbersOnlyValidator
  ],
  exports: [
    MinValueValidator,
    MaxValueValidator,
    NumbersOnlyValidator
  ]
})
export class MinMaxModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MinMaxModule,
      providers: []
    };
  }
}
