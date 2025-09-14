import { Component, OnInit, model, signal, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Check, LucideAngularModule, LucideIconData, Search, Users, X } from 'lucide-angular';
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
  imports: [MatTableModule, MatButtonModule, MatIconModule, LucideAngularModule],
})
export class GuestsListComponent implements OnInit, OnDestroy {
  readonly searchIcon = Search;
  readonly usersIcon = Users;

  searchTerm: string = '';
  guests: GuestModel[] = []
  displayedColumns: string[] = ['name', 'is_by_hellen'];
  isLogged: boolean = false;
  private loginSubscription!: Subscription

  readonly tableLayout: { table: number, x: number, y: number, seats: number, category: string }[] = [
    { table: 1, x: 20, y: 20, seats: 8, category: "Família dos Noivos" },
    { table: 2, x: 60, y: 20, seats: 6, category: "Amigos da Faculdade" },
    { table: 3, x: 20, y: 60, seats: 8, category: "Amigos Próximos" },
    { table: 4, x: 60, y: 60, seats: 6, category: "Colegas de Trabalho" },
    { table: 5, x: 40, y: 40, seats: 10, category: "Mesa Principal" },
  ]

  readonly categories: string[] = ["Todos", "Família", "Amigos", "Trabalho", "Faculdade"]
  selectedCategory: string = "Todos";
  selectedTable: number | null = null;
  filteredGuests: GuestModel[] = [];

  constructor(private readonly guestService: GuestService, private readonly loginService: LoginService) { }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.guestService.getGuests().subscribe()

    this.isLogged = this.loginService.isLoggedin();
    this.loginSubscription = this.loginService.$toggleLoggedIn.subscribe(res => this.isLogged = res);

    if (this.isLogged) this.displayedColumns.push('actions');

    this.getGuests();
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
      this.getFilteredGuests();
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

  getFilteredGuests(): void {
    this.filteredGuests = this.guests.filter((guest) => {
      const matchesSearch = guest.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      const matchesCategory = this.selectedCategory === "todos" || guest.category === this.selectedCategory
      const matchesTable = this.selectedTable === null || guest.table === this.selectedTable
      return matchesSearch && matchesCategory && matchesTable
    });
  }

  setSearchTerm(value: Event): void {
    this.searchTerm = (value.target as HTMLInputElement).value;
  }

  setSelectedCategory(category: string): void {
    this.selectedCategory = category;
  }

  setSelectedTable(table: number | null): void {
    this.selectedTable = table;
  }

  getConfirmationStatus(confirmed: boolean): { icon: LucideIconData, bg: string, color: string, text: string } {
    return {
      icon: confirmed ? Check : X,
      bg: confirmed ? 'bg-green-200' : 'bg-red-200',
      color: confirmed ? 'text-green-600' : 'text-red-600',
      text: confirmed ? 'Confirmado' : 'Não Confirmado',
    }
  }
}
