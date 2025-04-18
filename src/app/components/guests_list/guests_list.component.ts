import { Component, OnInit } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { GuestService } from '../../services/guest.service';
import { GuestModel } from '../../models/guest-model';

@Component({
  standalone: true,
  selector: 'app-guests-list',
  templateUrl: './guests_list.component.html',
  styleUrls: ['./guests_list.component.scss'],
  imports: [MatTableModule],
})
export class GuestsListComponent implements OnInit {
  guests: GuestModel[] = []
  displayedColumns: string[] = ['name', 'is_by_hellen'];

  constructor(private readonly guestService: GuestService) { }
  
  ngOnInit(): void {
    this.getGuests()
  }

  getGuests(): void {
    this.guestService.getGuests().subscribe((guests) => {
      this.guests = guests
    })
  }
}
