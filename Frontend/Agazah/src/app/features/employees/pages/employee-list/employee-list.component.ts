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

@Component({
  selector: 'app-employee-list',

  standalone: true,

  imports: [
    CommonModule
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
}
