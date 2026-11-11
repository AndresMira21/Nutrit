import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-onboarding',
  imports: [ReactiveFormsModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Onboarding {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  profileForm = this.fb.group({
    weight: [70, [Validators.required, Validators.min(30)]],
    height: [175, [Validators.required, Validators.min(100)]],
    age: [25, [Validators.required, Validators.min(15)]],
    gender: ['male', Validators.required]
  });

  saveProfile() {
    if (this.profileForm.valid) {
      this.authService.updateProfile(this.profileForm.value as any);
      this.router.navigate(['/dashboard']);
    }
  }
}