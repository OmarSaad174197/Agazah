import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  PageEvent
} from '@angular/material/paginator';

import {
  MatDialog
} from '@angular/material/dialog';

import {
  MatSnackBar
} from '@angular/material/snack-bar';

import {
  Router
} from '@angular/router';

import {
  EmployeeService
} from '../../services/employee.service';

import {
  Employee
} from '../../models/employee.model';

import {
  EmployeeFormDialogComponent
} from '../../components/employee-form-dialog/employee-form-dialog.component';

import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material.imports';

import {
  getQualificationName
} from '../../../../shared/helpers/qualification.helper';


@Component({
  selector: 'app-employee-list',

  standalone: true,

  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './employee-list.component.html',

  styleUrl:
    './employee-list.component.css'
})
export class EmployeeListComponent
  implements OnInit {

  private readonly employeeService =
    inject(EmployeeService);

  private readonly dialog =
    inject(MatDialog);

  private readonly snackBar =
    inject(MatSnackBar);

  private readonly router =
    inject(Router);


  employees: Employee[] = [];

  isLoading = false;

  isDeletingId: number | null = null;

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


  getQualificationName =
    getQualificationName;


  ngOnInit(): void {

    this.loadEmployees();
  }


  loadEmployees(): void {

    this.isLoading = true;

    this.employeeService
      .getPaged(
        this.pageNumber,
        this.pageSize
      )
      .subscribe({

        next: result => {

          this.employees =
            result.items ?? [];

          this.totalCount =
            result.totalCount;

          this.isLoading = false;

          this.adjustPageAfterLoad();
        },

        error: () => {

          this.isLoading = false;
        }

      });
  }


  private adjustPageAfterLoad(): void {

    if (
      this.pageNumber > 1 &&
      this.employees.length === 0 &&
      this.totalCount > 0
    ) {

      this.pageNumber--;

      this.loadEmployees();
    }
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


  viewDetails(
    employeeId: number
  ): void {

    this.router.navigate([
      '/employees',
      employeeId
    ]);
  }


  openEditDialog(
    employee: Employee
  ): void {

    if (this.isDeletingId !== null) {
      return;
    }

    this.employeeService
      .getById(employee.id)
      .subscribe({

        next: employeeDetails => {

          const dialogRef =
            this.dialog.open(
              EmployeeFormDialogComponent,
              {
                width: '700px',
                maxWidth: '95vw',
                disableClose: true,

                data: {
                  mode: 'edit',
                  employee: employeeDetails
                }
              }
            );

          dialogRef
            .afterClosed()
            .subscribe(result => {

              if (result === true) {

                this.loadEmployees();
              }

            });
        }

      });
  }


  openCreateDialog(): void {

    if (this.isDeletingId !== null) {
      return;
    }

    const dialogRef =
      this.dialog.open(
        EmployeeFormDialogComponent,
        {
          width: '600px',
          maxWidth: '95vw',
          disableClose: true,

          data: {
            mode: 'create'
          }
        }
      );

    dialogRef
      .afterClosed()
      .subscribe(created => {

        if (!created) {
          return;
        }

        this.loadEmployees();
      });
  }


  openDeleteDialog(
    employee: Employee
  ): void {

    if (this.isDeletingId !== null) {
      return;
    }

    const dialogData:
      ConfirmDialogData = {

      title:
        'تأكيد حذف الموظف',

      message:
        `هل أنت متأكد من حذف الموظف "${employee.employeeName}"؟`,

      confirmText:
        'حذف',

      cancelText:
        'إلغاء'
    };


    const dialogRef =
      this.dialog.open(
        ConfirmDialogComponent,
        {
          width: '450px',
          maxWidth: '95vw',
          disableClose: true,

          data: dialogData
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(confirmed => {

        if (!confirmed) {
          return;
        }

        this.deleteEmployee(employee);
      });
  }


  private deleteEmployee(
    employee: Employee
  ): void {

    if (this.isDeletingId !== null) {
      return;
    }

    this.isDeletingId =
      employee.id;


    this.employeeService
      .delete(employee.id)
      .subscribe({

        next: () => {

          this.isDeletingId = null;

          this.snackBar.open(
            'تم حذف الموظف بنجاح',
            'إغلاق',
            {
              duration: 3000
            }
          );

          this.loadEmployees();
        },

        error: () => {

          this.isDeletingId = null;
        }

      });
  }


  isDeleting(
    employeeId: number
  ): boolean {

    return this.isDeletingId === employeeId;
  }

}
