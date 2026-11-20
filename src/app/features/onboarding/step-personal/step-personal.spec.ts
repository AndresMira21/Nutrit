import { TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { StepPersonal } from './step-personal';

describe('StepPersonal', () => {
  it('muestra y asocia el mensaje de un campo inválido', async () => {
    await TestBed.configureTestingModule({ imports: [StepPersonal] }).compileComponents();
    const fixture = TestBed.createComponent(StepPersonal);
    const group = new FormBuilder().group({
      name: ['', Validators.required],
      weight: 70,
      height: 175,
      age: 25,
      gender: 'male',
    });
    fixture.componentRef.setInput('group', group);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('#onboarding-name-error')).toBeNull();

    fixture.componentRef.setInput('showErrors', true);
    fixture.detectChanges();

    expect(root.querySelector('#onboarding-name-error')?.textContent).toContain('dos letras');
    expect(root.querySelector('#onboarding-name')?.getAttribute('aria-describedby')).toBe(
      'onboarding-name-error',
    );
  });
});
