import { Component, HostListener, Input } from '@angular/core';

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
  @Input() closedImage: string = 'invite-envelope.png';
  /** Decorative paper used as the background of the opened message (paper variant). */
  @Input() paperImage: string = 'invite-gafa.png';
  /** Accessible label for the envelope image. */
  @Input() alt: string = 'Convite';

  /** Letter variant only — decorative letterhead, greeting and signature. All optional. */
  @Input() monogram: string = '';
  @Input() greeting: string = '';
  @Input() signoff: string = '';
  @Input() signature: string = '';
  @Input() heart: boolean = true;
  /** Custom character for the wax seal (e.g. '✝'). Overrides the default heart. */
  @Input() seal: string = '';

  isOpened: boolean = false;
  isOpening: boolean = false;

  get displaySeal(): string {
    return this.seal || (this.heart ? '❤' : '');
  }

  openInvite(): void {
    if (this.isOpened || this.isOpening) return;
    this.isOpening = true;
    setTimeout(() => {
      this.isOpened = true;
      this.isOpening = false;
    }, 550);
  }

  closeInvite(): void {
    if (!this.isOpened) return;
    this.isOpened = false;
    this.isOpening = false;
  }

  /** Closes the opened letter when clicking the backdrop (outside the sheet). */
  onBackdropClick(event: MouseEvent): void {
    if (!this.isOpened) return;
    const target = event.target as HTMLElement;
    if (target.closest('.surface')) return;
    this.closeInvite();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeInvite();
  }
}
