import { Component } from '@angular/core';

@Component({
  selector: 'app-invite-gafa',
  standalone: true,
  imports: [],
  templateUrl: './invite-gafa.component.html',
  styleUrl: './invite-gafa.component.scss'
})
export class InviteGafaComponent {
  isOpened: boolean = false;

  openInvite(): void {
    setTimeout(() => {
      this.isOpened = !this.isOpened;
    }, 150);
  }
}
