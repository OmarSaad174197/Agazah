import {
  Routes
} from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full'
  },

  {
    path: 'employees',
    loadComponent: () =>
      import(
        './features/employees/pages/employee-list/employee-list.component'
      )
      .then(
        m => m.EmployeeListComponent
      )
  },

  {
    path: 'employees/:id',
    loadComponent: () =>
      import(
        './features/employees/pages/employee-details/employee-details.component'
      )
      .then(
        m => m.EmployeeDetailsComponent
      )
  },

  {
    path: '**',
    redirectTo: 'employees'
  }

];
