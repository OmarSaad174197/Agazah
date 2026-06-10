import { Component, inject } from '@angular/core';

import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
}
from '@angular/forms';

import {
  MatDialogRef
}
from '@angular/material/dialog';

import { MATERIAL_MODULES }
from '../../../../shared/material/material.imports';

import { Qualification }
from '../../../../shared/enums/qualification.enum';

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

  private readonly dialogRef =
    inject(MatDialogRef<EmployeeFormDialogComponent>);

  qualifications =
    Object.values(Qualification)
      .filter(x => typeof x === 'number');

  maxBirthDate = new Date();
  form = this.fb.group({

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
    Validators.required
  ],

  qualification: [
    null,
    Validators.required
  ]
});

  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    this.dialogRef.close(
      this.form.getRawValue());
  }

  close(): void {

    this.dialogRef.close();
  }

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
}
