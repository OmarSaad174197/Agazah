import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  PageEvent
} from '@angular/material/paginator';

import {
  MatDialog
} from '@angular/material/dialog';

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

import {
  NotificationService
} from '../../../../core/services/notification.service';


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

  private readonly router =
    inject(Router);

  private readonly notificationService =
    inject(NotificationService);


  employees: Employee[] = [];

  isLoading = false;

  isDeletingId: number | null = null;

  isLoadingEditId: number | null = null;

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

    if (this.isActionDisabled()) {
      return;
    }

    this.isLoadingEditId =
      employee.id;

    this.employeeService
      .getById(employee.id)
      .subscribe({

        next: employeeDetails => {

          this.isLoadingEditId = null;

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
        },

        error: () => {

          this.isLoadingEditId = null;
        }

      });
  }


  openCreateDialog(): void {

    if (this.isActionDisabled()) {
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

    if (this.isActionDisabled()) {
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

          this.notificationService.success(
            'تم حذف الموظف بنجاح'
          );

          this.loadEmployees();
        },

        error: (error: HttpErrorResponse) => {

          this.isDeletingId = null;

          if (error.status === 404) {

            this.loadEmployees();
          }
        }

      });
  }


  isDeleting(
    employeeId: number
  ): boolean {

    return this.isDeletingId === employeeId;
  }


  isOpeningEdit(
    employeeId: number
  ): boolean {

    return this.isLoadingEditId === employeeId;
  }


  isActionDisabled(): boolean {

    return this.isLoading ||
      this.isDeletingId !== null ||
      this.isLoadingEditId !== null;
  }

}
