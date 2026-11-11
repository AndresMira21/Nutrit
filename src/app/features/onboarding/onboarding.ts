import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-onboarding',
  imports: [ReactiveFormsModule, FormsModule, DecimalPipe],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Onboarding {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly numericFields = [
    { control: 'weight', label: 'Peso (kg)', min: 30, max: 300 },
    { control: 'height', label: 'Estatura (cm)', min: 100, max: 250 },
    { control: 'age', label: 'Edad', min: 15, max: 100 }
  ] as const;

  readonly genders = [
    { value: 'male', label: 'Hombre' },
    { value: 'female', label: 'Mujer' }
  ] as const;

  profileForm = this.fb.nonNullable.group({
    name: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(40),
      Validators.pattern(/^[\p{L}' ]+$/u)
    ]],
    weight: [70, [Validators.required, Validators.min(30), Validators.max(300)]],
    height: [175, [Validators.required, Validators.min(100), Validators.max(250)]],
    age: [25, [Validators.required, Validators.min(15), Validators.max(100)]],
    gender: ['male' as User['gender'], Validators.required]
  });

  // Two-Way Binding
  acceptTerms = signal(false);

  private formValue = toSignal(this.profileForm.valueChanges, {
    initialValue: this.profileForm.getRawValue()
  });
  bmiPreview = computed(() => {
    const { weight, height } = this.formValue();
    return weight && height ? weight / Math.pow(height / 100, 2) : 0;
  });

  get f() { return this.profileForm.controls; }

  showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  // Event Binding (blur): normaliza ortografia
  formatName(): void {
    const c = this.f.name;
    c.setValue(
      c.value.trim().replace(/\s+/g, ' ').split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    );
  }

  // Event Binding (click)
  selectGender(value: User['gender']): void {
    this.f.gender.setValue(value);
    this.f.gender.markAsDirty();
  }

  saveProfile(): void {
    if (this.profileForm.invalid || !this.acceptTerms()) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.authService.updateProfile(this.profileForm.getRawValue());
    this.router.navigate(['/dashboard']);
  }
}