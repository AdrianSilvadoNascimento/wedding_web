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

  onGiftChange(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('giftChange', (gift) => {
        observer.next(gift);
      });
    });
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
}
