import {
  CommonModule
} from '@angular/common';

import {
  HttpErrorResponse
} from '@angular/common/http';

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
  MatDialog
} from '@angular/material/dialog';

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

import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

import {
  NotificationService
} from '../../../../core/services/notification.service';

import {
  Vacation
} from '../../../vacations/models/vacation.model';

import {
  VacationFormDialogComponent
} from '../../../vacations/components/vacation-form-dialog/vacation-form-dialog.component';

import {
  VacationService
} from '../../../vacations/services/vacation.service';

import {
  getVacationTypeBadgeClass,
  getVacationTypeName
} from '../../../../shared/helpers/vacation-type.helper';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly employeeService = inject(EmployeeService);

  private readonly vacationService = inject(VacationService);

  private readonly dialog = inject(MatDialog);

  private readonly notificationService = inject(NotificationService);

  employee: EmployeeDetails | null = null;

  isLoading = false;

  isNotFound = false;

  loadErrorMessage = '';

  isDeletingVacationId: number | null = null;

  employeeId = 0;

  readonly displayedVacationColumns = [
    'vacationType',
    'startDate',
    'duration',
    'actions'
  ];

  readonly getQualificationName = getQualificationName;

  readonly getVacationTypeName = getVacationTypeName;

  readonly getVacationTypeBadgeClass = getVacationTypeBadgeClass;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.goBack();
      return;
    }

    this.employeeId = id;
    this.loadEmployee();
  }

  loadEmployee(): void {
    this.isLoading = true;
    this.isNotFound = false;
    this.loadErrorMessage = '';

    this.employeeService.getById(this.employeeId).subscribe({
      next: employee => {
        this.employee = employee;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.employee = null;
        this.isLoading = false;

        if (error.status === 404) {
          this.isNotFound = true;
          return;
        }

        this.loadErrorMessage =
          'تعذر تحميل بيانات الموظف. يرجى المحاولة مرة أخرى.';
      }
    });
  }

  retryLoad(): void {
    if (!this.isLoading) {
      this.loadEmployee();
    }
  }

  openAddVacationDialog(): void {
    if (!this.employee || this.isVacationActionDisabled()) {
      return;
    }

    const dialogRef = this.dialog.open(
      VacationFormDialogComponent,
      {
        width: '620px',
        maxWidth: '95vw',
        disableClose: true,
        data: {
          employeeId: this.employee.id,
          employeeName: this.employee.employeeName
        }
      }
    );

    dialogRef.afterClosed().subscribe(created => {
      if (created === true) {
        this.loadEmployee();
      }
    });
  }

  openDeleteVacationDialog(
    vacation: Vacation
  ): void {
    if (this.isVacationActionDisabled()) {
      return;
    }

    const dialogData: ConfirmDialogData = {
      title: 'تأكيد حذف الإجازة',
      message: `هل أنت متأكد من حذف إجازة ${this.getVacationTypeName(vacation.vacationType)}؟`,
      confirmText: 'حذف',
      cancelText: 'إلغاء'
    };

    const dialogRef = this.dialog.open(
      ConfirmDialogComponent,
      {
        width: '450px',
        maxWidth: '95vw',
        disableClose: true,
        data: dialogData
      }
    );

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed === true) {
        this.deleteVacation(vacation);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  isDeletingVacation(
    vacationId: number
  ): boolean {
    return this.isDeletingVacationId === vacationId;
  }

  isVacationActionDisabled(): boolean {
    return this.isLoading ||
      this.isDeletingVacationId !== null;
  }

  private deleteVacation(
    vacation: Vacation
  ): void {
    if (this.isVacationActionDisabled()) {
      return;
    }

    this.isDeletingVacationId = vacation.id;

    this.vacationService.delete(vacation.id).subscribe({
      next: () => {
        this.isDeletingVacationId = null;
        this.notificationService.success('تم حذف الإجازة بنجاح');
        this.loadEmployee();
      },
      error: (error: HttpErrorResponse) => {
        this.isDeletingVacationId = null;

        if (error.status === 404) {
          this.loadEmployee();
        }
      }
    });
  }
}
