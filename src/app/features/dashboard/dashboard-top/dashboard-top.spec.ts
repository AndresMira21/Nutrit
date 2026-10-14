import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardTop } from './dashboard-top';

describe('DashboardTop', () => {
  let component: DashboardTop;
  let fixture: ComponentFixture<DashboardTop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTop],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardTop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
