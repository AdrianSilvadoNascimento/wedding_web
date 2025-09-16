import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GiftStatus, GiftStatusEnum } from '../models/gift-model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  useHeaders({ isAdmin = false, isSkiping = false }: { isAdmin?: boolean, isSkiping?: boolean }): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })

    if (isAdmin) headers = headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    if (isSkiping) headers = headers.set('X-Skip-Loading', 'true')

    return headers
  }

  badgeGiftStatus(status: string): { label: string, style: string } {
    const availableStyle = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold badge-available-animated';
    
    switch (status) {
      case GiftStatusEnum.AVAILABLE:
        return {
          label: 'Disponível',
          style: availableStyle
        };
      case GiftStatusEnum.BLOCK:
        return { label: 'Alguém Está Analisando', style: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-600 border-0' };
      case GiftStatusEnum.RESERVED:
        return { label: 'Reservado', style: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-600 border-0' };
      case GiftStatusEnum.SOLD:
        return { label: 'Comprado', style: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 border-0' };
      default:
        return { label: 'Disponível', style: availableStyle };
    }
  }
}
