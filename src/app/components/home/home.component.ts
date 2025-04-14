import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // Lógica do componente
} 