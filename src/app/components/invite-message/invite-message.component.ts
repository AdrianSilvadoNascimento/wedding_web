import { Component, Input } from '@angular/core';

export type InviteVariant = 'paper' | 'letter';

@Component({
  selector: 'app-invite-message',
  standalone: true,
  imports: [],
  templateUrl: './invite-message.component.html',
  styleUrl: './invite-message.component.scss'
})
export class InviteMessageComponent {
  /** Visual style of the opened invite. */
  @Input() variant: InviteVariant = 'paper';
  /** Envelope shown before the invite is opened. */
  @Input() closedImage: string = 'invite-gafa-closed.png';
  /** Decorative paper used as the background of the opened message (paper variant). */
  @Input() paperImage: string = 'invite-gafa.png';
  /** Accessible label for the envelope image. */
  @Input() alt: string = 'Convite';

  /** Letter variant only — decorative letterhead, greeting and signature. All optional. */
  @Input() monogram: string = '';
  @Input() greeting: string = '';
  @Input() signoff: string = '';
  @Input() signature: string = '';

  isOpened: boolean = false;

  openInvite(): void {
    if (this.isOpened) return;
    setTimeout(() => {
      this.isOpened = true;
    }, 150);
  }
}
