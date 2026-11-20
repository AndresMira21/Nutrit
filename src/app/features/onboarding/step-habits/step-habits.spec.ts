import { TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { StepHabits } from './step-habits';

describe('StepHabits', () => {
  it('muestra el mensaje cuando falta aceptar el tratamiento de datos', async () => {
    await TestBed.configureTestingModule({ imports: [StepHabits] }).compileComponents();
    const fixture = TestBed.createComponent(StepHabits);
    const group = new FormBuilder().group({
      exercises: false,
      mealsPerDay: 3,
      waterGlasses: 6,
      goal: 'maintain',
      acceptTerms: [false, Validators.requiredTrue],
    });
    fixture.componentRef.setInput('group', group);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('#onboarding-terms-error')).toBeNull();

    fixture.componentRef.setInput('showErrors', true);
    fixture.detectChanges();

    expect(root.querySelector('#onboarding-terms-error')?.textContent).toContain(
      'tratamiento de tus datos',
    );
    expect(root.querySelector('input[type="checkbox"]')?.getAttribute('aria-invalid')).toBe('true');
  });
});
