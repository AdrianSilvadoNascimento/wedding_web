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
    'Accept': 'application/json',
  })

  private adminHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
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

  createGuest(guest: GuestModel): Observable<GuestModel> {
    const storedGuests = localStorage.getItem('guests')
    
    return this.http.post<GuestModel>(`${this.apiUrl}/guest/`, guest, { headers: this.adminHeaders }).pipe(
      tap((res: any) => {
        if (storedGuests) {
          const guests = JSON.parse(storedGuests)
          guests.push(res)
          this.updateGuestsData(guests)
        } else {
          this.updateGuestsData(res as GuestModel[])
        }
      })
    )
  }

  setGuestCache(guests: GuestModel[]): void {
    localStorage.setItem('guests', JSON.stringify(guests))
  }
}
