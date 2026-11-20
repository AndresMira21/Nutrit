import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-step-personal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './step-personal.html',
  styleUrl: './step-personal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepPersonal {
  group = input.required<FormGroup>();
  showErrors = input(false);

  protected showError(field: string): boolean {
    const control = this.group().get(field);
    return !!control?.invalid && (control.touched || this.showErrors());
  }
}
