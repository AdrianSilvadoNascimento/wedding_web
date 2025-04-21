import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isMobile: boolean = window.innerWidth <= 768;
  isLogged: boolean = false;
  guestsRoute: string = '/convidados';
  giftsRoute: string = '/presentes';

  constructor(private readonly loginService: LoginService) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isMobile = (event.target as Window).innerWidth <= 768;
  }

  ngOnInit(): void {
    this.loginService.$toggleLoggedIn.subscribe(res => {
      this.isLogged = res;
      this.guestsRoute = this.isLogged ? '/admin/convidados' : '/convidados';
      this.giftsRoute = this.isLogged ? '/admin/presentes' : '/presentes';
    })
  }
}
