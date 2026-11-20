import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  output
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivityLevel, Goal, User } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-editor.html',
  styleUrl: './profile-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileEditor implements OnInit {
  private readonly fb = inject(FormBuilder);

  user = input.required<User>();
  save = output<Partial<User>>();
  cancel = output<void>();

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[\p{L}' ]+$/u)]],
    weight: [70, [Validators.required, Validators.min(30), Validators.max(300)]],
    height: [165, [Validators.required, Validators.min(100), Validators.max(250)]],
    age: [20, [Validators.required, Validators.min(15), Validators.max(100)]],
    gender: ['female' as User['gender'], Validators.required],
    activityLevel: ['' as ActivityLevel | ''],
    goal: ['maintain' as Goal, Validators.required],
    mealsPerDay: [3, [Validators.required, Validators.min(1), Validators.max(8)]],
    waterGlasses: [6, [Validators.required, Validators.min(0), Validators.max(20)]]
  });

  ngOnInit(): void {
    const user = this.user();
    const habits = user.habits;

    this.form.patchValue({
      name: user.name,
      weight: user.weight,
      height: user.height,
      age: user.age,
      gender: user.gender,
      activityLevel: habits?.activityLevel ?? '',
      goal: habits?.goal ?? 'maintain',
      mealsPerDay: habits?.mealsPerDay ?? 3,
      waterGlasses: habits?.waterGlasses ?? 6
    });
  }

  saveChanges(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    const existingHabits = this.user().habits;

    this.save.emit({
      name: values.name.trim(),
      weight: values.weight,
      height: values.height,
      age: values.age,
      gender: values.gender,
      habits: existingHabits ? {
        ...existingHabits,
        activityLevel: values.activityLevel || undefined,
        goal: values.goal,
        mealsPerDay: values.mealsPerDay,
        waterGlasses: values.waterGlasses
      } : undefined
    });
  }

  cancelChanges(): void {
    this.cancel.emit();
  }
}
