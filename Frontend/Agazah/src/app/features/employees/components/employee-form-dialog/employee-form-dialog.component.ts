import {
  Component,
  Inject,
  OnInit,
  inject
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material.imports';

import {
  NotificationService
} from '../../../../core/services/notification.service';

import {
  EmployeeService
} from '../../services/employee.service';

import {
  EmployeeDetails
} from '../../models/employee-details.model';

import {
  CreateEmployee
} from '../../models/create-employee.model';

import {
  UpdateEmployee
} from '../../models/update-employee.model';

import {
  Qualification
} from '../../../../shared/enums/qualification.enum';

export interface EmployeeFormDialogData {
  mode: 'create' | 'edit';

  employee?: EmployeeDetails;
}

type EmployeeFormValue = {
  employeeNumber: string;
  employeeName: string;
  birthDate: Date | null;
  qualification: number;
};

@Component({
  selector: 'app-employee-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],
  templateUrl: './employee-form-dialog.component.html',
  styleUrl: './employee-form-dialog.component.css'
})
export class EmployeeFormDialogComponent implements OnInit {
  private readonly fb =
    inject(FormBuilder);

  private readonly employeeService =
    inject(EmployeeService);

  private readonly notificationService =
    inject(NotificationService);

  private readonly dialogRef =
    inject(MatDialogRef<EmployeeFormDialogComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: EmployeeFormDialogData
  ) {}

  isSaving = false;

  readonly maxBirthDate = new Date();

  readonly qualifications = [
    {
      value: Qualification.HighSchool,
      label: 'ثانوية عامة'
    },
    {
      value: Qualification.Diploma,
      label: 'متوسط'
    },
    {
      value: Qualification.Bachelor,
      label: 'بكالوريوس'
    },
    {
      value: Qualification.Master,
      label: 'ماجستير'
    },
    {
      value: Qualification.PhD,
      label: 'دكتوراه'
    }
  ];

  readonly form =
    this.fb.nonNullable.group({
      employeeNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          this.notBlank
        ]
      ],
      employeeName: [
        '',
        [
          Validators.required,
          Validators.maxLength(200),
          this.notBlank
        ]
      ],
      birthDate: [
        null as Date | null,
        [
          Validators.required
        ]
      ],
      qualification: [
        0,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(5)
        ]
      ]
    });

  get isEditMode(): boolean {
    return this.data.mode === 'edit';
  }

  get dialogTitle(): string {
    return this.isEditMode
      ? 'تعديل بيانات الموظف'
      : 'إضافة موظف';
  }

  ngOnInit(): void {
    if (!this.isEditMode || !this.data.employee) {
      return;
    }

    const employee = this.data.employee;

    this.form.patchValue({
      employeeNumber: employee.employeeNumber,
      employeeName: employee.employeeName,
      birthDate: new Date(employee.birthDate),
      qualification: employee.qualification
    });

    this.form.controls.employeeNumber.disable();
  }

  save(): void {
    if (this.isSaving) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    if (this.isEditMode) {
      this.updateEmployee(formValue);
      return;
    }

    this.createEmployee(formValue);
  }

  close(): void {
    if (this.isSaving) {
      return;
    }

    this.dialogRef.close(false);
  }

  private createEmployee(
    formValue: EmployeeFormValue
  ): void {
    const dto: CreateEmployee = {
      employeeNumber: formValue.employeeNumber.trim(),
      employeeName: formValue.employeeName.trim(),
      birthDate: this.toDateOnlyString(formValue.birthDate),
      qualification: formValue.qualification
    };

    this.isSaving = true;

    this.employeeService.create(dto).subscribe({
      next: () => {
        this.isSaving = false;
        this.notificationService.success('تمت إضافة الموظف بنجاح');
        this.dialogRef.close(true);
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }

  private updateEmployee(
    formValue: EmployeeFormValue
  ): void {
    if (!this.data.employee) {
      return;
    }

    const dto: UpdateEmployee = {
      employeeName: formValue.employeeName.trim(),
      birthDate: this.toDateOnlyString(formValue.birthDate),
      qualification: formValue.qualification
    };

    this.isSaving = true;

    this.employeeService
      .update(
        this.data.employee.id,
        dto
      )
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.notificationService.success('تم تحديث بيانات الموظف بنجاح');
          this.dialogRef.close(true);
        },
        error: () => {
          this.isSaving = false;
        }
      });
  }

  private toDateOnlyString(
    value: Date | null
  ): string {
    if (!value) {
      return '';
    }

    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, '0');
    const day = `${value.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private notBlank(
    control: AbstractControl<string>
  ): ValidationErrors | null {
    return control.value.trim().length > 0
      ? null
      : {
        blank: true
      };
  }
}
