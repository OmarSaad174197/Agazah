import {
  Component,
  Inject,
  inject
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MatDialogModule
} from '@angular/material/dialog';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';


export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}


@Component({
  selector: 'app-confirm-dialog',

  standalone: true,

  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],

  templateUrl:
    './confirm-dialog.component.html',

  styleUrl:
    './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {

  private readonly dialogRef =
    inject(
      MatDialogRef<ConfirmDialogComponent>
    );

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: ConfirmDialogData
  ) {}


  cancel(): void {

    this.dialogRef.close(false);
  }


  confirm(): void {

    this.dialogRef.close(true);
  }
}
