import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardBottom } from './dashboard-bottom';

describe('DashboardBottom', () => {
  let component: DashboardBottom;
  let fixture: ComponentFixture<DashboardBottom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardBottom],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardBottom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
