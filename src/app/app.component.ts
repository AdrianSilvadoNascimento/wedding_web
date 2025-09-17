import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from "./components/footer/footer.component";
import { LoadingComponent } from './components/loading/loading.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'wedding-web';

  isInviteGafa: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.isInviteGafa = this.router.url.includes('gafa');
  }
}
