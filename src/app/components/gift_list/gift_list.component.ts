import { Component, inject, model, signal, LOCALE_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ShoppingCart, LucideAngularModule, ExternalLink } from 'lucide-angular';

import { LoginService } from '../../services/login.service';
import { DialogComponent } from './dialog/dialog.component';
import { GiftService } from '../../services/gift.service';
import { GiftModel, GiftStatus, GiftStatusEnum } from '../../models/gift-model';
import { GiftSocketService } from '../../utils/gift-socket.service';
import { UtilsService } from '../../utils/utils.service';
import { PresentOwnerModalComponent } from '../present-owner-modal/present-owner-modal.component';

registerLocaleData(localePt);

@Component({
  standalone: true,
  selector: 'app-gift-list',
  imports: [MatButtonModule, CurrencyPipe, LucideAngularModule, PresentOwnerModalComponent],
  templateUrl: './gift_list.component.html',
  styleUrls: ['./gift_list.component.scss'],
  providers: [{
    provide: LOCALE_ID,
    useValue: "pt-BR"
  }],
})
export class GiftListComponent {
  readonly shoppingCartIcon = ShoppingCart;
  readonly externalLinkIcon = ExternalLink;

  gifts: GiftModel[] = [];
  isLogged: boolean = false;

  // Modal state
  isModalVisible = false;
  selectedGift: GiftModel | null = null;

  // Timer para atualizar contador
  private timerInterval: any;

  private loginSubscription!: Subscription;
  private giftStatusChangeSubscription!: Subscription;

  readonly description = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);

  constructor(
    private readonly giftService: GiftService,
    private readonly loginService: LoginService,
    private readonly giftSocketService: GiftSocketService,
    readonly utilsService: UtilsService
  ) { }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
    this.giftStatusChangeSubscription.unsubscribe();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  ngOnInit(): void {
    this.giftService.getGifts().subscribe();

    this.isLogged = this.loginService.isLoggedin();

    this.loginSubscription = this.loginService.$toggleLoggedIn.subscribe(
      (res) => {
        this.isLogged = res;
      }
    );

    this.getGifts();

    this.subscribeToGiftStatusChange();
    this.startTimer();
  }

  subscribeToGiftStatusChange(): void {
    this.giftStatusChangeSubscription = this.giftSocketService.onGiftStatusChange().subscribe({
      next: (data) => {
        const gift = this.gifts.find(p => p.id === data.giftId);
        if (gift) gift.status = data.status;

        this.giftService.updateGiftsData(this.gifts);
      },
      error: (error) => {
        console.error('Error subscribing to gift status change:', error);
      }
    });
  }

  createGiftDialog(): void {
    if (!this.isLogged) return;

    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe(() => this.getGifts());
  }

  openEditDialog(giftId: string): void {
    const gift: GiftModel | undefined = this.gifts.find(
      (gift) => gift.id === giftId
    );
    if (!gift) return;

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        id: gift.id,
        name: gift.name,
        description: gift.description,
        price: gift.price,
      },
    });

    dialogRef.afterClosed().subscribe(() => this.getGifts());
  }

  getGifts(): void {
    this.giftService.$giftsData.subscribe((gifts) => {
      this.gifts = gifts;
    });
  }

  deleteGift(giftId: string): void {
    if (!this.isLogged) return;

    const gift: GiftModel | undefined = this.gifts.find(
      (gift) => gift.id === giftId
    );
    if (!confirm(`Você vai excluir ${gift?.name}?`)) return;

    this.giftService.deleteGift(giftId).subscribe(() => {
      this.getGifts();
    });
  }

  blockGift(giftId: string): void {
    console.log('blockGift method called with ID:', giftId);

    this.giftService.blockGift(giftId).subscribe({
      next: (blockedGift) => {
        const index = this.gifts.findIndex(g => g.id === giftId);
        if (index !== -1) {
          this.gifts[index] = blockedGift;
        }
        console.log('Gift blocked successfully:', blockedGift);
      },
      error: (error) => {
        console.error('Error blocking gift:', error);
      }
    });
  }

  isSold(status: string): boolean {
    return status === GiftStatusEnum.SOLD;
  }

  cardButton(status: string): string {
    switch (status) {
      case GiftStatusEnum.AVAILABLE:
        return 'Ver na Loja';
      case GiftStatusEnum.BLOCK:
        return 'Alguém Está Analisando';
      case GiftStatusEnum.SOLD:
        return 'Já Comprado';
      case GiftStatusEnum.RESERVED:
        return 'Foi Reservado';
      default:
        return 'Ver na Loja';
    }
  }

  onViewStore(gift: GiftModel): void {
    if (this.isGiftAvailable(gift.status)) {
      this.blockGift(gift.id);

      this.selectedGift = gift;
      this.isModalVisible = true;
    }

    else if (this.isSold(gift.status)) {
      this.selectedGift = gift;
      this.isModalVisible = true;
    }

    if (gift.link) {
      window.open(gift.link, '_blank');
    }
  }

  onModalClose(): void {
    this.isModalVisible = false;
    this.selectedGift = null;
  }

  onModalSuccess(updatedGift: GiftModel): void {
    const index = this.gifts.findIndex(g => g.id === updatedGift.id);
    if (index !== -1) {
      this.gifts[index] = updatedGift;
    }
  }

  isBlocked(gift: GiftModel): boolean {
    return gift.status.valueOf() === GiftStatusEnum.BLOCK && gift.blocked_at !== null;
  }

  isGiftAvailable(status: string): boolean {
    return status === GiftStatusEnum.AVAILABLE;
  }

  getTimeRemaining(blockedAt: string | Date): number {
    if (!blockedAt) return 0;

    const blockedTime = new Date(blockedAt);
    const now = new Date();
    const timeDiff = now.getTime() - blockedTime.getTime();
    const minutesElapsed = Math.floor(timeDiff / (1000 * 60));
    const minutesRemaining = Math.max(0, 20 - minutesElapsed);

    return minutesRemaining;
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.gifts = [...this.gifts];
    }, 30000);
  }
}
