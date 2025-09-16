import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { GiftModel } from '../models/gift-model';
import { UtilsService } from '../utils/utils.service';
import { PresentOwnerRequest } from '../models/present-owner-model';

@Injectable({
  providedIn: 'root',
})
export class GiftService {
  private readonly apiUrl = `${environment.apiUrl}/gift`;

  private giftsData: BehaviorSubject<GiftModel[]>;
  $giftsData: Observable<GiftModel[]>;

  constructor(private http: HttpClient, private readonly utilsService: UtilsService) {
    const storedGifts = sessionStorage.getItem('gifts');
    const parsedGifts = storedGifts ? JSON.parse(storedGifts) : [];

    this.giftsData = new BehaviorSubject<GiftModel[]>(parsedGifts);
    this.$giftsData = this.giftsData.asObservable();
  }

  updateGiftsData(giftsData: GiftModel[]): void {
    this.giftsData.next(giftsData);
    this.setGiftCache(giftsData);
  }

  getGifts(): Observable<GiftModel[]> {
    return this.http.get<GiftModel[]>(`${this.apiUrl}/`, { headers: this.utilsService.useHeaders({}) }).pipe(
      tap((res) => this.updateGiftsData(res))
    );
  }

  createGift(gift: GiftModel): Observable<GiftModel> {
    const storedGifts = sessionStorage.getItem('gifts');

    return this.http.post<GiftModel>(`${this.apiUrl}/create`, gift, {
      headers: this.utilsService.useHeaders({ isAdmin: true }),
    }).pipe(tap((res: GiftModel) => {
      let gifts = storedGifts ? JSON.parse(storedGifts) : [];
      gifts.push(res);
      gifts = gifts.flat();
      this.updateGiftsData(gifts);
    }));
  }

  updateGift(giftId: string, gift: GiftModel): Observable<GiftModel[]> {
    const storedGifts = sessionStorage.getItem('gifts');

    return this.http.put<GiftModel[]>(`${this.apiUrl}/update/${giftId}`, gift, {
      headers: this.utilsService.useHeaders({ isAdmin: true }),
    }).pipe(tap((res) => {
      let gifts = storedGifts ? JSON.parse(storedGifts) : [];
      gifts = gifts.map((item: GiftModel) =>
        item.id === giftId ? res : item
      );
      this.updateGiftsData(gifts);
    })
    );
  }

  blockGift(giftId: string): Observable<GiftModel> {
    const storedGifts = sessionStorage.getItem('gifts');
    
    return this.http.patch<GiftModel>(`${this.apiUrl}/${giftId}/status`, 
      { status: 'BLOCK' },
      { headers: this.utilsService.useHeaders({ isSkiping: true }) }
    ).pipe(tap((updatedGift) => {
      console.log('BLOCKED GIFT:', updatedGift);
      
      let gifts = storedGifts ? JSON.parse(storedGifts) : [];
      gifts = gifts.map((item: GiftModel) =>
        item.id === giftId ? updatedGift : item
      );
      this.updateGiftsData(gifts);
    }));
  }

  deleteGift(giftId: string): Observable<GiftModel[]> {
    return this.http.delete<GiftModel[]>(`${this.apiUrl}/delete/${giftId}`, {
      headers: this.utilsService.useHeaders({ isAdmin: true }),
    }).pipe(tap((res) => this.updateGiftsData(res)));
  }

  setPresentOwner(giftId: string, presentOwnerData: PresentOwnerRequest): Observable<GiftModel> {
    return this.http.post<GiftModel>(`${this.apiUrl}/${giftId}/present-owner`, presentOwnerData, {
      headers: this.utilsService.useHeaders({})
    }).pipe(
      tap((updatedGift) => {
        // Atualiza o presente na lista local
        const storedGifts = sessionStorage.getItem('gifts');
        let gifts = storedGifts ? JSON.parse(storedGifts) : [];
        gifts = gifts.map((item: GiftModel) =>
          item.id === giftId ? updatedGift : item
        );
        this.updateGiftsData(gifts);
      })
    );
  }

  setGiftCache(gifts: GiftModel[]): void {
    sessionStorage.setItem('gifts', JSON.stringify(gifts));
  }
}
