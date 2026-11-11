import { Component, inject, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import {
  AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule,
  ValidationErrors, Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ActivityLevel, DietType, Goal, User } from '../../core/models/user.model';
import { NumberStepper } from '../../shared/number-stepper/number-stepper';

// Validador personalizado: al menos una comida seleccionada
const atLeastOneMeal = (group: AbstractControl): ValidationErrors | null =>
  Object.values(group.value).some(Boolean) ? null : { noMeals: true };

@Component({
  selector: 'app-onboarding',
  imports: [ReactiveFormsModule, FormsModule, DecimalPipe, NumberStepper],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Onboarding {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // ---------- Datos para el template ----------
  readonly stepLabels = ['Datos personales', 'Hábitos'];

  readonly numericFields = [
    { control: 'weight', label: 'Peso (kg)', min: 30, max: 300 },
    { control: 'height', label: 'Estatura (cm)', min: 100, max: 250 },
    { control: 'age', label: 'Edad', min: 15, max: 100 }
  ] as const;

  readonly genders = [
    { value: 'male', label: 'Hombre' },
    { value: 'female', label: 'Mujer' }
  ] as const;

  readonly yesNo = [
    { value: true, label: 'Sí' },
    { value: false, label: 'No' }
  ] as const;

  readonly exerciseTypes = [
    { value: 'walking', label: 'Caminata' },
    { value: 'running', label: 'Correr' },
    { value: 'gym', label: 'Gimnasio / pesas' },
    { value: 'cycling', label: 'Ciclismo' },
    { value: 'swimming', label: 'Natación' },
    { value: 'team', label: 'Deporte en equipo' },
    { value: 'other', label: 'Otro' }
  ];

  readonly activityLevels: { value: ActivityLevel; label: string }[] = [
    { value: 'sedentary', label: 'Sedentario (poco movimiento diario)' },
    { value: 'light', label: 'Ligero (camino algo en el día)' },
    { value: 'moderate', label: 'Moderado (activo la mayor parte del día)' },
    { value: 'intense', label: 'Intenso (trabajo físico o entreno diario)' }
  ];

  readonly goals: { value: Goal; label: string }[] = [
    { value: 'lose', label: 'Bajar de peso' },
    { value: 'maintain', label: 'Mantener mi peso' },
    { value: 'gain', label: 'Ganar masa muscular' }
  ];

  readonly dietTypes: { value: DietType; label: string }[] = [
    { value: 'omnivore', label: 'Como de todo' },
    { value: 'vegetarian', label: 'Vegetariana' },
    { value: 'vegan', label: 'Vegana' },
    { value: 'other', label: 'Otra' }
  ];

  readonly mealOptions = [
    { key: 'breakfast', label: 'Desayuno' },
    { key: 'lunch', label: 'Almuerzo' },
    { key: 'dinner', label: 'Cena' },
    { key: 'snacks', label: 'Meriendas' }
  ] as const;

  readonly restrictionsMax = 200;

  // ---------- Formulario (2 grupos anidados) ----------
  onboardingForm = this.fb.nonNullable.group({
    personal: this.fb.nonNullable.group({
      name: ['', [
        Validators.required, Validators.minLength(2), Validators.maxLength(40),
        Validators.pattern(/^[\p{L}' ]+$/u)
      ]],
      weight: [70, [Validators.required, Validators.min(30), Validators.max(300)]],
      height: [175, [Validators.required, Validators.min(100), Validators.max(250)]],
      age: [25, [Validators.required, Validators.min(15), Validators.max(100)]],
      gender: ['male' as User['gender'], Validators.required]
    }),
    habits: this.fb.nonNullable.group({
      exercises: [false, Validators.required],
      exerciseType: ['walking', Validators.required],
      exerciseDaysPerWeek: [3, [Validators.required, Validators.min(1), Validators.max(7)]],
      exerciseMinutes: [30, [Validators.required, Validators.min(10), Validators.max(240)]],
      activityLevel: ['light' as ActivityLevel, Validators.required],
      mealsPerDay: [3, [Validators.required, Validators.min(1), Validators.max(8)]],
      meals: this.fb.nonNullable.group(
        { breakfast: [true], lunch: [true], dinner: [true], snacks: [false] },
        { validators: atLeastOneMeal }
      ),
      waterGlasses: [6, [Validators.required, Validators.min(0), Validators.max(20)]],
      dietType: ['omnivore' as DietType, Validators.required],
      goal: ['maintain' as Goal, Validators.required],
      restrictions: ['', Validators.maxLength(200)]
    })
  });

  // Atajos para el template
  get p() { return this.onboardingForm.controls.personal.controls; }
  get h() { return this.onboardingForm.controls.habits.controls; }

  // ---------- Estado ----------
  step = signal<1 | 2>(1);
  progress = computed(() => this.step() * 50);

  // Two-Way Binding: [(ngModel)] y [(value)] sobre signals
  acceptTerms = signal(false);
  mealsPerDay = signal(3);
  waterGlasses = signal(6);

  // Vista previa del IMC con los valores del paso 1
  private personalValue = toSignal(this.onboardingForm.controls.personal.valueChanges, {
    initialValue: this.onboardingForm.controls.personal.getRawValue()
  });
  bmiPreview = computed(() => {
    const { weight, height } = this.personalValue();
    return weight && height ? weight / Math.pow(height / 100, 2) : 0;
  });

  // ¿Se ejercita? -> habilita/deshabilita los campos de ejercicio
  private exercises = toSignal(this.h.exercises.valueChanges, { initialValue: false });

  constructor() {
    effect(() => {
      const on = this.exercises();
      [this.h.exerciseType, this.h.exerciseDaysPerWeek, this.h.exerciseMinutes]
        .forEach(c => (on ? c.enable({ emitEvent: false }) : c.disable({ emitEvent: false })));
    });

    // Sincroniza los steppers (signals) con el formulario reactivo
    effect(() => this.h.mealsPerDay.setValue(this.mealsPerDay()));
    effect(() => this.h.waterGlasses.setValue(this.waterGlasses()));
  }

  // ---------- Helpers ----------
  showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  // Event Binding (blur)
  formatName(): void {
    const c = this.p.name;
    c.setValue(
      c.value.trim().replace(/\s+/g, ' ').split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    );
  }

  // Event Binding (click)
  selectGender(value: User['gender']): void {
    this.p.gender.setValue(value);
    this.p.gender.markAsDirty();
  }

  next(): void {
    const personal = this.onboardingForm.controls.personal;
    personal.markAllAsTouched();
    if (personal.invalid) return;
    this.step.set(2);
  }

  back(): void {
    this.step.set(1);
  }

  saveProfile(): void {
    // Si presiona Enter en el paso 1, solo avanza
    if (this.step() === 1) { this.next(); return; }

    if (this.onboardingForm.invalid || !this.acceptTerms()) {
      this.onboardingForm.markAllAsTouched();
      return;
    }

    const { personal, habits } = this.onboardingForm.getRawValue();
    this.authService.updateProfile({
      ...personal,
      habits: {
        ...habits,
        restrictions: habits.restrictions.trim(),
        // si no se ejercita, se limpian los datos de ejercicio
        ...(habits.exercises ? {} : { exerciseType: 'none', exerciseDaysPerWeek: 0, exerciseMinutes: 0 })
      }
    });
    this.router.navigate(['/dashboard']);
  }
}