import { Component } from '@angular/core';
import { DashboardTop } from './dashboard-top/dashboard-top';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardTop],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}