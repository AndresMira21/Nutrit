import { Component, ChangeDetectionStrategy, input, model } from '@angular/core';

@Component({
  selector: 'app-number-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stepper">
      <button type="button" aria-label="Disminuir"
              [disabled]="value() <= min()" (click)="change(-1)">−</button>
      <output>{{ value() }} <small>{{ unit() }}</small></output>
      <button type="button" aria-label="Aumentar"
              [disabled]="value() >= max()" (click)="change(1)">+</button>
    </div>
  `,
  styles: `
    .stepper { display: flex; align-items: center; gap: 12px; }
    button { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #4caf50;
             background: #fff; color: #4caf50; font-size: 18px; cursor: pointer; }
    button:disabled { opacity: .4; cursor: not-allowed; }
    output { min-width: 90px; text-align: center; font-weight: 600; }
    small { font-weight: 400; color: #777; }
  `
})
export class NumberStepper {
  value = model(1);          // [(value)] desde el padre
  min = input(0);
  max = input(10);
  unit = input('');

  change(delta: number): void {
    this.value.update(v => Math.min(this.max(), Math.max(this.min(), v + delta)));
  }
}