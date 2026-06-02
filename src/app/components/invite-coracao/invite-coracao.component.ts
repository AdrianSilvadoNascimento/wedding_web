import { Component } from '@angular/core';

import { InviteMessageComponent } from '../invite-message/invite-message.component';

@Component({
  selector: 'app-invite-coracao',
  standalone: true,
  imports: [InviteMessageComponent],
  templateUrl: './invite-coracao.component.html',
  styleUrl: './invite-coracao.component.scss'
})
export class InviteCoracaoComponent {}
