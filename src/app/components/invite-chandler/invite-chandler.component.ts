import { Component } from '@angular/core';

import { InviteMessageComponent } from '../invite-message/invite-message.component';

@Component({
  selector: 'app-invite-chandler',
  standalone: true,
  imports: [InviteMessageComponent],
  templateUrl: './invite-chandler.component.html',
  styleUrl: './invite-chandler.component.scss'
})
export class InviteChandlerComponent {}
