import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { GiftModel } from '../models/gift-model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GiftService {
  private readonly apiUrl = `${environment.apiUrl}/gift`;

  private giftsData = new BehaviorSubject<GiftModel[]>([]);
  $giftsData = this.giftsData.asObservable();

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  private adminHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  constructor(private http: HttpClient) {}

  updateGiftsData(giftsData: GiftModel[]): void {
    this.giftsData.next(giftsData);
  }

  getGifts(): Observable<GiftModel[]> {
    return this.http
      .get<GiftModel[]>(`${this.apiUrl}/`, { headers: this.headers })
      .pipe(
        tap((res) => {
          this.updateGiftsData(res);
          this.setGiftCache(res);
        })
      );
  }

  createGift(gift: GiftModel): Observable<GiftModel> {
    const storedGifts = localStorage.getItem('gifts');

    return this.http
      .post<GiftModel>(`${this.apiUrl}/create`, gift, {
        headers: this.adminHeaders,
      })
      .pipe(
        tap((res: GiftModel) => {
          let gifts = storedGifts ? JSON.parse(storedGifts) : [];
          gifts.push(res);
          gifts = gifts.flat();
          this.updateGiftsData(gifts);
          this.setGiftCache(gifts);
        })
      );
  }

  updateGift(giftId: string, gift: GiftModel): Observable<GiftModel[]> {
    const storedGifts = localStorage.getItem('gifts');

    return this.http
      .put<GiftModel[]>(`${this.apiUrl}/update/${giftId}`, gift, {
        headers: this.adminHeaders,
      })
      .pipe(
        tap((res) => {
          let gifts = storedGifts ? JSON.parse(storedGifts) : [];
          gifts = gifts.map((item: GiftModel) =>
            item.id === giftId ? res : item
          );
          this.updateGiftsData(gifts);
          this.setGiftCache(gifts);
        })
      );
  }

  deleteGift(giftId: string): Observable<GiftModel[]> {
    return this.http
      .delete<GiftModel[]>(`${this.apiUrl}/delete/${giftId}`, {
        headers: this.adminHeaders,
      })
      .pipe(
        tap((res) => {
          this.updateGiftsData(res);
          this.setGiftCache(res);
        })
      );
  }

  setGiftCache(gifts: GiftModel[]): void {
    localStorage.setItem('gifts', JSON.stringify(gifts));
  }
}
