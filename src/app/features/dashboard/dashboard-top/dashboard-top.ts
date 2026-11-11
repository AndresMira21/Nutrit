import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-top',
  imports: [DecimalPipe],
  templateUrl: './dashboard-top.html',
  styleUrl: './dashboard-top.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardTop {
  water = input.required<string>();
  steps = input.required<string>();
  kcal = input.required<number>();
}