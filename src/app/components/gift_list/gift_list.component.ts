import { Component, inject, model, signal } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { LoginService } from '../../services/login.service';
import { DialogComponent } from './dialog/dialog.component';
import { GiftService } from '../../services/gift.service';
import { GiftModel } from '../../models/gift-model';

@Component({
  standalone: true,
  selector: 'app-gift-list',
  imports: [MatIcon, MatTableModule, MatButtonModule],
  templateUrl: './gift_list.component.html',
  styleUrls: ['./gift_list.component.scss'],
})
export class GiftListComponent {
  gifts: GiftModel[] = [];
  displayedColumns: string[] = ['name', 'description', 'price'];
  isLogged: boolean = false;
  private loginSubscription!: Subscription;

  readonly description = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);

  constructor(
    private readonly giftService: GiftService,
    private readonly loginService: LoginService
  ) {}

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
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

    if (this.isLogged) {
      this.displayedColumns.push('actions');
    }

    this.getGifts();
  }

  createGiftDialog(): void {
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
}
