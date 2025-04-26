import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  OnInit,
  signal,
} from '@angular/core';
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

import { GiftModel } from '../../../models/gift-model';
import { GiftService } from '../../../services/gift.service';

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
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<GiftModel>(MAT_DIALOG_DATA);

  giftForm: FormGroup = new FormGroup({});

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly giftService: GiftService
  ) {}

  ngOnInit(): void {
    this.createForm(this.data || new GiftModel());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm(model: GiftModel): void {
    this.giftForm = this.formBuilder.group({
      name: [model.name, Validators.required],
      description: [model.description, Validators.required],
      price: [model.price, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.data) {
      this.giftService
        .updateGift(this.data.id, this.giftForm.value)
        .subscribe(() => {
          this.giftForm.reset();
          this.dialogRef.close();
          alert('Presente atualizado com sucesso!');
        });
    } else {
      this.giftService.createGift(this.giftForm.value).subscribe(() => {
        this.giftForm.reset();
        this.dialogRef.close();
        alert('Presente criado com sucesso!');
      });
    }
  }
}
