import { Component } from '@angular/core';

import { Heart, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-godparents',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './godparents.component.html',
  styleUrl: './godparents.component.scss'
})
export class GodparentsComponent {
  readonly heartIcon = Heart

}
