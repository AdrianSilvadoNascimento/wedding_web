import { Component } from '@angular/core';

import { InviteMessageComponent } from '../invite-message/invite-message.component';

@Component({
  selector: 'app-invite-gafa',
  standalone: true,
  imports: [InviteMessageComponent],
  templateUrl: './invite-gafa.component.html',
  styleUrl: './invite-gafa.component.scss'
})
export class InviteGafaComponent {}
