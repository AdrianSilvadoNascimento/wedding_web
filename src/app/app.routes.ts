import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { GuestsListComponent } from './components/guests_list/guests_list.component';
import { GiftListComponent } from './components/gift_list/gift_list.component';
import { InviteComponent } from './components/invite/invite.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'convidados', component: GuestsListComponent },
  { path: 'presentes', component: GiftListComponent },
  { path: 'convite-madrinha', component: InviteComponent },
  { path: 'convite-padrinho', component: InviteComponent },
  { path: '**', redirectTo: '' },
];
