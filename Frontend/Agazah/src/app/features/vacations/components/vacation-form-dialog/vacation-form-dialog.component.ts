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
  NotificationService
} from '../../../../core/services/notification.service';

import {
  VacationType
} from '../../../../shared/enums/vacation-type.enum';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material.imports';

import {
  CreateVacation
} from '../../models/create-vacation.model';

import {
  VacationService
} from '../../services/vacation.service';

export interface VacationFormDialogData {
  employeeId: number;

  employeeName: string;
}

@Component({
  selector: 'app-vacation-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ],
  templateUrl: './vacation-form-dialog.component.html',
  styleUrl: './vacation-form-dialog.component.css'
})
export class VacationFormDialogComponent {
  private readonly fb =
    inject(FormBuilder);

  private readonly vacationService =
    inject(VacationService);

  private readonly notificationService =
    inject(NotificationService);

  private readonly dialogRef =
    inject(MatDialogRef<VacationFormDialogComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: VacationFormDialogData
  ) {}

  isSaving = false;

  readonly vacationTypes = [
    {
      value: VacationType.Annual,
      label: 'سنوية'
    },
    {
      value: VacationType.Sick,
      label: 'مرضية'
    },
    {
      value: VacationType.Emergency,
      label: 'طارئة'
    }
  ];

  readonly form =
    this.fb.nonNullable.group({
      vacationType: [
        0,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(3)
        ]
      ],
      startDate: [
        null as Date | null,
        [
          Validators.required
        ]
      ],
      duration: [
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(30)
        ]
      ]
    });

  save(): void {
    if (this.isSaving) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const dto: CreateVacation = {
      employeeId: this.data.employeeId,
      vacationType: formValue.vacationType,
      startDate: this.toDateOnlyString(formValue.startDate),
      duration: formValue.duration
    };

    this.isSaving = true;

    this.vacationService.create(dto).subscribe({
      next: () => {
        this.isSaving = false;
        this.notificationService.success('تمت إضافة الإجازة بنجاح');
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
}
