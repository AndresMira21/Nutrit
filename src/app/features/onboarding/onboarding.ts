import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ActivityLevel, DietType, Goal, User } from '../../core/models/user.model';
import { StepPersonal } from './step-personal/step-personal';
import { StepHabits } from './step-habits/step-habits';

const atLeastOneMeal = (group: AbstractControl): ValidationErrors | null =>
  Object.values(group.value).some(Boolean) ? null : { noMeals: true };

@Component({
  selector: 'app-onboarding',
  imports: [ReactiveFormsModule, StepPersonal, StepHabits],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Onboarding {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly stepLabels = ['Datos personales', 'Hábitos'];
  step = signal<1 | 2>(1);
  progress = computed(() => this.step() * 50);
  isLoading = signal(false);

  onboardingForm = this.fb.nonNullable.group({
    personal: this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[\p{L}' ]+$/u)]],
      weight: [70, [Validators.required, Validators.min(30), Validators.max(300)]],
      height: [175, [Validators.required, Validators.min(100), Validators.max(250)]],
      age: [25, [Validators.required, Validators.min(15), Validators.max(100)]],
      gender: ['male' as User['gender'], Validators.required]
    }),
    habits: this.fb.nonNullable.group({
      exercises: [false],
      mealsPerDay: [3, [Validators.required, Validators.min(1), Validators.max(8)]],
      waterGlasses: [6, [Validators.required, Validators.min(0), Validators.max(20)]],
      meals: this.fb.nonNullable.group(
        { breakfast: [true], lunch: [true], dinner: [true], snacks: [false] },
        { validators: atLeastOneMeal }
      ),
      goal: ['maintain' as Goal],
      acceptTerms: [false, Validators.requiredTrue]
    })
  });

  get personalGroup() { return this.onboardingForm.controls.personal; }
  get habitsGroup() { return this.onboardingForm.controls.habits; }
  get mealsGroup() { return this.onboardingForm.controls.habits.controls.meals; }

  next() {
    if (this.personalGroup.invalid) {
      this.personalGroup.markAllAsTouched();
      return;
    }
    this.step.set(2);
  }

  back() { this.step.set(1); }

  saveProfile() {
    if (this.onboardingForm.invalid) {
      this.onboardingForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    
    setTimeout(() => {
      const { personal, habits } = this.onboardingForm.getRawValue();
      const { acceptTerms, ...validHabits } = habits;

      this.authService.updateProfile({
        ...personal,
        habits: validHabits as any
      });
      this.router.navigate(['/dashboard']);
      this.isLoading.set(false);
    }, 1000);
  }
}