import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { GuestsListComponent } from './components/guests_list/guests_list.component';
import { GiftListComponent } from './components/gift_list/gift_list.component';
import { InviteComponent } from './components/invite/invite.component';
import { LoginComponent } from './admin/auth/login/login.component';
import { authGuard } from './admin/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'convidados', component: GuestsListComponent },
  { path: 'presentes', component: GiftListComponent },
  { path: 'ela', component: InviteComponent },
  { path: 'ele', component: InviteComponent },
  { path: 'admin/login', component: LoginComponent },
  { path: 'admin/convidados', component: GuestsListComponent, canActivate: [authGuard] },
  { path: 'admin/presentes', component: GiftListComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
