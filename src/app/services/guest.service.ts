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

  private guestsData: BehaviorSubject<GuestModel[]>
  $guestsData: Observable<GuestModel[]>

  constructor(private http: HttpClient) {
    const storedGuests = localStorage.getItem('guests')
    const parsedGuests = storedGuests ? JSON.parse(storedGuests) : []

    this.guestsData = new BehaviorSubject<GuestModel[]>(parsedGuests)
    this.$guestsData = this.guestsData.asObservable()
  }

  private useHeaders(isAdmin: boolean = false, isSkiping: boolean = false): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })

    if (isAdmin) headers = headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)

    return headers
  }
  
  private updateGuestsData(guestsData: GuestModel[]): void {
    this.setGuestCache(guestsData)
    this.guestsData.next(guestsData)
  }

  getGuests(): Observable<GuestModel[]> {
    return this.http.get<GuestModel[]>(`${this.apiUrl}/`, { headers: this.useHeaders() }).pipe(
      tap(res => this.updateGuestsData(res))
    )
  }

  createGuest(guest: GuestModel): Observable<GuestModel> {
    const storedGuests = localStorage.getItem('guests')

    return this.http.post<GuestModel>(`${this.apiUrl}/create`, guest, { headers: this.useHeaders() }).pipe(
      tap((res: GuestModel) => {
        let guests = storedGuests ? JSON.parse(storedGuests) : []
        guests.push(res)
        guests = guests.flat()
        this.updateGuestsData(guests)
      })
    )
  }

  updateGuest(guestId: string, guest: GuestModel): Observable<GuestModel[]> {
    const storedGuests = localStorage.getItem('guests')
    
    return this.http.put<GuestModel[]>(`${this.apiUrl}/update/${guestId}`, guest, { headers: this.useHeaders() }).pipe(
      tap(res => {
        let guests = storedGuests ? JSON.parse(storedGuests) : []
        const index = guests.findIndex((g: GuestModel) => g.id === guestId)
        if (index !== -1) guests[index] = res

        this.updateGuestsData(guests)
      })
    )
  }

  deleteGuest(guestId: string): Observable<GuestModel[]> {
    return this.http.delete<GuestModel[]>(`${this.apiUrl}/delete/${guestId}`, { headers: this.useHeaders() }).pipe(
      tap(res => this.updateGuestsData(res))
    )
  }

  setGuestCache(guests: GuestModel[]): void {
    localStorage.setItem('guests', JSON.stringify(guests))
  }
}
