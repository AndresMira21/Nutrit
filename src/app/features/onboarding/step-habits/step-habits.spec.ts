import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepHabits } from './step-habits';

describe('StepHabits', () => {
  let component: StepHabits;
  let fixture: ComponentFixture<StepHabits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepHabits],
    }).compileComponents();

    fixture = TestBed.createComponent(StepHabits);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
