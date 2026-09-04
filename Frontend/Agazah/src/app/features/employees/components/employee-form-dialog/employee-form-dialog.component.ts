import {
  Component,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MatDialogRef
} from '@angular/material/dialog';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material.imports';

import {
  Qualification
} from '../../../../shared/enums/qualification.enum';

import {
  CreateEmployee
} from '../../models/create-employee.model';

import {
  EmployeeService
} from '../../services/employee.service';

import {
  NotificationService
} from '../../../../core/services/notification.service';

@Component({
  selector: 'app-employee-form-dialog',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './employee-form-dialog.component.html',

  styleUrl:
    './employee-form-dialog.component.css'
})
export class EmployeeFormDialogComponent {

  private readonly fb =
    inject(FormBuilder);

  private readonly employeeService =
    inject(EmployeeService);

  private readonly notificationService =
    inject(NotificationService);

  private readonly dialogRef =
    inject(
      MatDialogRef<
        EmployeeFormDialogComponent,
        boolean
      >
    );

  readonly qualifications =
    [
      Qualification.HighSchool,
      Qualification.Diploma,
      Qualification.Bachelor,
      Qualification.Master,
      Qualification.PhD
    ];

  readonly maxBirthDate =
    new Date();

  isSaving = false;

  form = this.fb.nonNullable.group({

    employeeNumber: [
      '',
      [
        Validators.required,
        Validators.maxLength(20)
      ]
    ],

    employeeName: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],

    birthDate: [
      null,
      [
        Validators.required
      ]
    ],

    qualification: [
      null,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(5)
      ]
    ]
  });

  getQualificationName(
    value: Qualification
  ): string {

    switch (value) {

      case Qualification.HighSchool:
        return 'ثانوية عامة';

      case Qualification.Diploma:
        return 'دبلوم';

      case Qualification.Bachelor:
        return 'بكالوريوس';

      case Qualification.Master:
        return 'ماجستير';

      case Qualification.PhD:
        return 'دكتوراه';

      default:
        return '';
    }
  }

  save(): void {

    if (this.isSaving) {
      return;
    }

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    const rawValue =
      this.form.getRawValue();

    const employeeName =
      rawValue.employeeName.trim();

    const employeeNumber =
      rawValue.employeeNumber.trim();

    if (!employeeName) {

      this.form.controls.employeeName
        .setErrors({
          required: true
        });

      this.form.controls.employeeName
        .markAsTouched();

      return;
    }

    if (!employeeNumber) {

      this.form.controls.employeeNumber
        .setErrors({
          required: true
        });

      this.form.controls.employeeNumber
        .markAsTouched();

      return;
    }

    const birthDate =
      rawValue.birthDate as Date | null;

    if (!birthDate) {

      return;
    }

    if (birthDate > this.maxBirthDate) {

      this.form.controls.birthDate
        .setErrors({
          futureDate: true
        });

      this.form.controls.birthDate
        .markAsTouched();

      return;
    }

    const dto: CreateEmployee = {

      employeeNumber,

      employeeName,

      birthDate:
        birthDate.toISOString(),

      qualification:
        rawValue.qualification as unknown as Qualification
    };

    this.isSaving = true;

    this.employeeService
      .create(dto)
      .subscribe({

        next: () => {

          this.isSaving = false;

          this.notificationService.success(
            'تمت إضافة الموظف بنجاح.'
          );

          this.dialogRef.close(true);
        },

        error: () => {

          this.isSaving = false;

          // رسالة الخطأ يعرضها الـ HTTP Interceptor.
          // يظل الـ Dialog مفتوحاً حتى يستطيع
          // المستخدم تصحيح البيانات.
        }
      });
  }

  close(): void {

    if (this.isSaving) {
      return;
    }

    this.dialogRef.close(false);
  }
}
