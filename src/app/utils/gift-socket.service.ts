import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

const socketUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class GiftSocketService {
  private readonly socket!: Socket;

  constructor() { 
    this.socket = io(socketUrl);
  }

  onGiftStatusChange(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('giftStatusChange', (data) => {
        observer.next(data);
      });
    });
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
}
