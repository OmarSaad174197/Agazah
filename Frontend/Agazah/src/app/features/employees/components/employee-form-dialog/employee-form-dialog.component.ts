import {
  Component,
  Inject,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MatSnackBar
} from '@angular/material/snack-bar';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material.imports';

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


export interface EmployeeFormDialogData {
  mode: 'create' | 'edit';

  employee?: EmployeeDetails;
}


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

  private readonly snackBar =
    inject(MatSnackBar);

  private readonly dialogRef =
    inject(
      MatDialogRef<EmployeeFormDialogComponent>
    );

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: EmployeeFormDialogData
  ) {}

  isSaving = false;

  readonly maxBirthDate = new Date();

  readonly form =
    this.fb.nonNullable.group({

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

    const employee =
      this.data.employee;

    this.form.patchValue({

      employeeNumber:
        employee.employeeNumber,

      employeeName:
        employee.employeeName,

      birthDate:
        new Date(employee.birthDate),

      qualification:
        employee.qualification

    });
  }


  save(): void {

    if (this.isSaving) {
      return;
    }

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    const formValue =
      this.form.getRawValue();

    if (this.isEditMode) {

      this.updateEmployee(formValue);

      return;
    }

    this.createEmployee(formValue);
  }


  private createEmployee(
    formValue: {
      employeeNumber: string;
      employeeName: string;
      birthDate: Date | null;
      qualification: number;
    }
  ): void {

    const dto: CreateEmployee = {

      employeeNumber:
        formValue.employeeNumber.trim(),

      employeeName:
        formValue.employeeName.trim(),

      birthDate:
        formValue.birthDate!.toISOString().split('T')[0],

      qualification:
        formValue.qualification

    };

    this.isSaving = true;

    this.employeeService
      .create(dto)
      .subscribe({

        next: () => {

          this.isSaving = false;

          this.snackBar.open(
            'تمت إضافة الموظف بنجاح',
            'إغلاق',
            {
              duration: 3000
            }
          );

          this.dialogRef.close(true);
        },

        error: () => {

          this.isSaving = false;
        }

      });
  }


  private updateEmployee(
    formValue: {
      employeeNumber: string;
      employeeName: string;
      birthDate: Date | null;
      qualification: number;
    }
  ): void {

    if (!this.data.employee) {
      return;
    }

    const dto: UpdateEmployee = {

      employeeName:
        formValue.employeeName.trim(),

      birthDate:
        formValue.birthDate!.toISOString().split('T')[0],

      qualification:
        formValue.qualification

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

          this.snackBar.open(
            'تم تحديث بيانات الموظف بنجاح',
            'إغلاق',
            {
              duration: 3000
            }
          );

          this.dialogRef.close(true);
        },

        error: () => {

          this.isSaving = false;
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
