import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { LucideAngularModule, Heart } from 'lucide-angular';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  readonly heartIcon = Heart;
  
  isLogged: boolean = false;
  guestsRoute: string = '/convidados';
  giftsRoute: string = '/presentes';
  
  constructor(private router: Router, private readonly loginService: LoginService) {}

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  ngOnInit(): void {
    this.loginService.$toggleLoggedIn.subscribe(res => {
      this.isLogged = res;
      this.guestsRoute = this.isLogged ? '/admin/convidados' : '/convidados';
      this.giftsRoute = this.isLogged ? '/admin/presentes' : '/presentes';
    })
  }

  logout(): void {
    this.loginService.logout();
  }
}
