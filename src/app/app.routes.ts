import { Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { DefaultLayoutComponent } from './containers/default-layout/default-layout.component';
import { AdminApprovalComponent } from './views/dashboard/admin-approval/admin-approval.component';
import { MonthComponent } from './views/dashboard/month/month.component';
import { BookingComponent } from './views/dashboard/booking/booking.component';
import { BookingoverviewComponent } from './views/dashboard/bookingoverview/bookingoverview.component';
import { BudgetSetupComponent } from './views/dashboard/budget-setup/budget-setup.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  //{ path: 'dashboard', component: DashboardComponent },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      { path: 'dashboard',  component: DashboardComponent },
      { path:'dashboard/AdminApproval', component:AdminApprovalComponent},
      { path:'dashboard/Month', component:MonthComponent},
      { path:'dashboard/Booking',component:BookingComponent},
      { path:'dashboard/Budgetoverview', component:BookingoverviewComponent },
      { path:'dashboard/Setup',component:BudgetSetupComponent },
    ]
  },
];