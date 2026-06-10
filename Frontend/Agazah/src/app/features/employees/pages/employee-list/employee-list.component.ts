import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { EmployeeService }
from '../../services/employee.service';

import { Employee }
from '../../models/employee.model';

import { MATERIAL_MODULES }
from '../../../../shared/material/material.imports';

import { getQualificationName }
from '../../../../shared/helpers/qualification.helper';

import { PageEvent }
from '@angular/material/paginator';
@Component({
  selector: 'app-employee-list',

  standalone: true,


  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './employee-list.component.html',

  styleUrls:
    ['./employee-list.component.css']
})
export class EmployeeListComponent
implements OnInit {

  private readonly employeeService =
    inject(EmployeeService);

  employees: Employee[] = [];

  isLoading = false;

  pageNumber = 1;

  pageSize = 5;

  totalCount = 0;

  displayedColumns = [
    'employeeNumber',
    'employeeName',
    'qualification',
    'totalVacationDays',
    'actions'
  ];

  getQualificationName = getQualificationName;

  ngOnInit(): void {

    this.loadEmployees();
  }

  loadEmployees(): void {

    this.isLoading = true;

    this.employeeService
      .getPaged(
        this.pageNumber,
        this.pageSize)
      .subscribe({

        next: result => {

          this.employees =
            result.items;

          this.totalCount =
            result.totalCount;

          this.isLoading = false;
        },

        error: () => {

          this.isLoading = false;
        }
      });
  }

  onPageChanged(
    event: PageEvent
  ): void {

    this.pageNumber =
      event.pageIndex + 1;

    this.pageSize =
      event.pageSize;

    this.loadEmployees();
  }
}
