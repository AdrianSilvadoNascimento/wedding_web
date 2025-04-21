import { ChangeDetectionStrategy, Component, inject, model, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { GuestModel } from '../../../models/guest-model';
import { GuestService } from '../../../services/guest.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatOptionModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<GuestModel>(MAT_DIALOG_DATA);

  guestForm: FormGroup = new FormGroup({});

  constructor(private readonly formBuilder: FormBuilder, private readonly guestService: GuestService) { }

  ngOnInit(): void {
    this.createForm(this.data || new GuestModel());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm(model: GuestModel): void {
    this.guestForm = this.formBuilder.group({
      name: [model.name, Validators.required],
      is_by_hellen: [model.is_by_hellen, Validators.required],
    });
  }

  onSubmit(): void {    
    if (this.data) {
      this.guestService.updateGuest(this.data.id, this.guestForm.value).subscribe(() => {
        this.guestForm.reset();
        this.dialogRef.close();
      });
    } else {
      this.guestService.createGuest(this.guestForm.value).subscribe(() => {
        this.guestForm.reset();
        this.dialogRef.close();
      });
    }
  }
}
