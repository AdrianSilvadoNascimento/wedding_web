import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, tap } from 'rxjs';
import { GuestModel } from '../models/guest-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private readonly apiUrl = environment.apiUrl;

  private guestsData = new BehaviorSubject<GuestModel[]>([new GuestModel()])
  $guestsData = this.guestsData.asObservable()

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })

  constructor(private http: HttpClient) { }

  updateGuestsData(guestsData: GuestModel[]): void {
    this.setGuestCache(guestsData)
    this.guestsData.next(guestsData)
  }

  getGuests(): Observable<GuestModel[]> {
    return this.http.get<GuestModel[]>(`${this.apiUrl}/guest/`, { headers: this.headers }).pipe(
      tap(res => {
        this.updateGuestsData(res)
      })
    )
  }

  setGuestCache(guests: GuestModel[]): void {
    localStorage.setItem('guests', JSON.stringify(guests))
  }
}
