import { Component, OnInit, model, signal, inject } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { GuestService } from '../../services/guest.service';
import { GuestModel } from '../../models/guest-model';
import { LoginService } from '../../services/login.service';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  standalone: true,
  selector: 'app-guests-list',
  templateUrl: './guests_list.component.html',
  styleUrls: ['./guests_list.component.scss'],
  imports: [MatTableModule, MatButtonModule, MatIconModule],
})
export class GuestsListComponent implements OnInit {
  guests: GuestModel[] = []
  displayedColumns: string[] = ['name', 'is_by_hellen'];
  isLogged: boolean = false;

  constructor(private readonly guestService: GuestService, private readonly loginService: LoginService) { }

  ngOnInit(): void {
    this.guestService.getGuests().subscribe()

    this.loginService.$toggleLoggedIn.subscribe(res => {
      this.isLogged = res
    })

    if (this.isLogged) {
      this.displayedColumns.push('actions')
    }

    this.getGuests()
  }

  readonly is_by_hellen = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);

  createGuestDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe(() => this.getGuests());
  }

  openEditDialog(guestId: string): void {
    const guest: GuestModel | undefined = this.guests.find((guest) => guest.id === guestId)
    if (!guest) return

    const dialogRef = this.dialog.open(DialogComponent, {
      data: { id: guest.id, name: guest.name, is_by_hellen: guest.is_by_hellen },
    });

    dialogRef.afterClosed().subscribe(() => this.getGuests());
  }

  getGuests(): void {
    this.guestService.$guestsData.subscribe((guests) => {
      this.guests = guests
    })
  }

  deleteGuest(guestId: string): void {
    if (!this.isLogged) return

    const guest: GuestModel | undefined = this.guests.find((guest) => guest.id === guestId)
    if (!confirm(`Você vai excluir ${guest?.name}?`)) return

    this.guestService.deleteGuest(guestId).subscribe(() => {
      this.getGuests()
    })
  }
}
