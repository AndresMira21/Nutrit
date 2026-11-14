import { Component, forwardRef, input, ChangeDetectionStrategy, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-number-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NumberStepper), multi: true }],
  template: `
    <div class="stepper-container">
      <button type="button" class="btn-step" [disabled]="value() <= min()" (click)="change(-1)">−</button>
      <div class="display">
        <span class="number">{{ value() }}</span>
        <span class="unit">{{ unit() }}</span>
      </div>
      <button type="button" class="btn-step" [disabled]="value() >= max()" (click)="change(1)">+</button>
    </div>
  `,
  styles: `
    .stepper-container { display: flex; align-items: center; justify-content: space-between; background: #F3F4F6; border-radius: 24px; padding: 6px; width: 100%; }
    .btn-step { width: 48px; height: 48px; border-radius: 50%; border: none; background: #FFFFFF; color: #4CAF50; font-size: 24px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.08); cursor: pointer; transition: all 0.2s; }
    .btn-step:hover:not(:disabled) { background: #4CAF50; color: #FFFFFF; }
    .btn-step:disabled { opacity: 0.4; cursor: not-allowed; }
    .display { display: flex; flex-direction: column; align-items: center; }
    .number { font-size: 24px; font-weight: 800; color: #1a1a1a; line-height: 1; }
    .unit { font-size: 12px; color: #757575; font-weight: 600; text-transform: uppercase; margin-top: 2px; }
  `
})
export class NumberStepper implements ControlValueAccessor {
  value = signal(0);
  min = input(0);
  max = input(10);
  unit = input('');

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: number): void { this.value.set(val || 0); }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  change(delta: number): void {
    const newValue = Math.min(this.max(), Math.max(this.min(), this.value() + delta));
    this.value.set(newValue);
    this.onChange(newValue);
    this.onTouched();
  }
}