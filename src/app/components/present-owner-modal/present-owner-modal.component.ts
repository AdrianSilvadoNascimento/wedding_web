import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { GiftService } from '../../services/gift.service';
import { GiftModel } from '../../models/gift-model';
import { PresentOwnerRequest } from '../../models/present-owner-model';
import { GuestModel } from '../../models/guest-model';
import { GuestService } from '../../services/guest.service';

@Component({
  selector: 'app-present-owner-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './present-owner-modal.component.html',
  styleUrls: ['./present-owner-modal.component.scss']
})
export class PresentOwnerModalComponent {
  @Input() gift: GiftModel | null = null;
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<GiftModel>();

  guests: GuestModel[] = [];
  
  presentOwnerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private giftService: GiftService,
    private guestService: GuestService
  ) {
    this.presentOwnerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      action: ['', Validators.required],
      notes: [''],
      estimated_delivery: ['']
    });
  }

  ngOnInit() {
    this.getGuests();

    this.presentOwnerForm.get('action')?.valueChanges.subscribe(action => {
      const estimatedDeliveryControl = this.presentOwnerForm.get('estimated_delivery');
      if (action === 'SOLD') {
        estimatedDeliveryControl?.setValidators([Validators.required]);
      } else {
        estimatedDeliveryControl?.clearValidators();
      }
      estimatedDeliveryControl?.updateValueAndValidity();
    });
  }

  getGuests(): void {
    this.guestService.$guestsData.subscribe({
      next: (guests) => {
        this.guests = guests;
      }
    })
  }

  onSubmit() {
    if (this.presentOwnerForm.valid && this.gift) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData: PresentOwnerRequest = {
        name: this.presentOwnerForm.get('name')?.value,
        action: this.presentOwnerForm.get('action')?.value,
        notes: this.presentOwnerForm.get('notes')?.value || '',
        estimated_delivery: this.presentOwnerForm.get('estimated_delivery')?.value || ''
      };

      this.giftService.setPresentOwner(this.gift.id, formData).subscribe({
        next: (updatedGift) => {
          this.isLoading = false;
          this.successMessage = `Presente ${formData.action === 'RESERVED' ? 'reservado' : 'comprado'} com sucesso!`;
          
          // Emite o presente atualizado e fecha o modal após 2 segundos
          this.success.emit(updatedGift);
          setTimeout(() => {
            this.closeModal();
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erro ao processar solicitação. Tente novamente.';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  closeModal() {
    this.presentOwnerForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = false;
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.presentOwnerForm.controls).forEach(key => {
      this.presentOwnerForm.get(key)?.markAsTouched();
    });
  }

  // Getters para facilitar a validação no template
  get name() { return this.presentOwnerForm.get('name'); }
  get action() { return this.presentOwnerForm.get('action'); }
  get notes() { return this.presentOwnerForm.get('notes'); }
  get estimated_delivery() { return this.presentOwnerForm.get('estimated_delivery'); }

  getActionLabel(): string {
    const action = this.action?.value;
    return action === 'RESERVED' ? 'Reservar' : action === 'SOLD' ? 'Comprar' : 'Selecione uma ação';
  }

  getNotesPlaceholder(): string {
    const action = this.action?.value;
    if (action === 'RESERVED') {
      return 'Opcional - Deixe uma observação se necessário';
    } else if (action === 'SOLD') {
      return 'Opcional - Informações sobre entrega, onde comprou, etc.';
    }
    return 'Observações (opcional)';
  }
}
