import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NumberStepper } from '../../../shared/number-stepper/number-stepper';

@Component({
  selector: 'app-step-habits',
  standalone: true,
  imports: [ReactiveFormsModule, NumberStepper],
  templateUrl: './step-habits.html',
  styleUrl: './step-habits.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepHabits {
  group = input.required<FormGroup>();
  showErrors = input(false);

  protected showTermsError(): boolean {
    const terms = this.group().get('acceptTerms');
    return !!terms?.invalid && (terms.touched || this.showErrors());
  }
}
