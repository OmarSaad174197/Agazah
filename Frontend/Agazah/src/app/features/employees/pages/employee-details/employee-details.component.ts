import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  CommonModule
} from '@angular/common';

import {
  EmployeeService
} from '../../services/employee.service';

import {
  EmployeeDetails
} from '../../models/employee-details.model';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material.imports';

import {
  getQualificationName
} from '../../../../shared/helpers/qualification.helper';

@Component({
  selector: 'app-employee-details',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './employee-details.component.html',

  styleUrl:
    './employee-details.component.css'
})
export class EmployeeDetailsComponent
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly employeeService =
    inject(EmployeeService);

  employee: EmployeeDetails | null = null;

  isLoading = false;

  employeeId = 0;

  readonly displayedVacationColumns = [
    'vacationType',
    'startDate',
    'duration'
  ];

  getQualificationName =
    getQualificationName;

  ngOnInit(): void {

    const id =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    if (!Number.isInteger(id) || id <= 0) {

      this.goBack();

      return;
    }

    this.employeeId = id;

    this.loadEmployee();
  }

  loadEmployee(): void {

    this.isLoading = true;

    this.employeeService
      .getById(this.employeeId)
      .subscribe({

        next: employee => {

          this.employee = employee;

          this.isLoading = false;
        },

        error: () => {

          this.isLoading = false;
        }
      });
  }

  goBack(): void {

    this.router.navigate([
      '/employees'
    ]);
  }
}
