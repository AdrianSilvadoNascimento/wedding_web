import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, tap } from 'rxjs';
import { GuestModel } from '../models/guest-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private readonly apiUrl = `${environment.apiUrl}/guest`;

  private guestsData = new BehaviorSubject<GuestModel[]>([])
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
    this.guestsData.next(guestsData)
  }

  getGuests(): Observable<GuestModel[]> {
    return this.http.get<GuestModel[]>(`${this.apiUrl}/`, { headers: this.headers }).pipe(
      tap(res => {
        this.updateGuestsData(res)
        this.setGuestCache(res)
      })
    )
  }

  createGuest(guest: GuestModel): Observable<GuestModel> {
    const storedGuests = localStorage.getItem('guests')

    return this.http.post<GuestModel>(`${this.apiUrl}/create`, guest, { headers: this.adminHeaders }).pipe(
      tap((res: GuestModel) => {
        let guests = storedGuests ? JSON.parse(storedGuests) : []
        guests.push(res)
        guests = guests.flat()
        this.updateGuestsData(guests)
        this.setGuestCache(guests)
      })
    )
  }

  updateGuest(guestId: string, guest: GuestModel): Observable<GuestModel[]> {
    const storedGuests = localStorage.getItem('guests')
    
    return this.http.put<GuestModel[]>(`${this.apiUrl}/update/${guestId}`, guest, { headers: this.adminHeaders }).pipe(
      tap(res => {
        let guests = storedGuests ? JSON.parse(storedGuests) : []
        const index = guests.findIndex((g: GuestModel) => g.id === guestId)
        if (index !== -1) {
          guests[index] = res
        }

        this.updateGuestsData(guests)
        this.setGuestCache(guests)
      })
    )
  }

  deleteGuest(guestId: string): Observable<GuestModel[]> {
    return this.http.delete<GuestModel[]>(`${this.apiUrl}/delete/${guestId}`, { headers: this.adminHeaders }).pipe(
      tap(res => {
        this.updateGuestsData(res)
        this.setGuestCache(res)
      })
    )
  }

  setGuestCache(guests: GuestModel[]): void {
    localStorage.setItem('guests', JSON.stringify(guests))
  }
}
