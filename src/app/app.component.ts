import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

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
export class AppComponent {
  title = 'wedding-web';
  /** Routes flagged with `data.chromeless` render without the site header/footer. */
  chromeless = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) route = route.firstChild;
        this.chromeless = route.data?.['chromeless'] === true;
      });
  }
}
