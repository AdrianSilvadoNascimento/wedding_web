import { Component, inject } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from '../../services/loading.service';
import { InviteDialog } from './dialog/invite-body.component';

@Component({
  selector: 'app-invite',
  standalone: true,
  imports: [],
  templateUrl: './invite.component.html',
  styleUrl: './invite.component.scss'
})
export class InviteComponent {

  readonly dialog = inject(MatDialog);
  isOpened: boolean = false;
  isOpening: boolean = false;

  constructor(readonly loadingService: LoadingService) { }

  openInvite(): void {
    if (this.isOpened || this.isOpening) return;
    
    this.isOpening = true;

    // Simulate opening animation duration
    setTimeout(() => {
      this.isOpening = false;
      this.isOpened = true;
      
      // Give a slight delay before showing the invite content
      setTimeout(() => {
        const dialogRef = this.dialog.open(InviteDialog, {
          panelClass: 'custom-invite-dialog',
          maxWidth: '100vw',
          enterAnimationDuration: '600ms',
          exitAnimationDuration: '400ms'
        });

        dialogRef.afterClosed().subscribe(() => {
          this.isOpened = false;
        });
      }, 400);
      
    }, 1500);
  }
}
