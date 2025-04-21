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

  constructor(readonly loadingService: LoadingService) { }

  openInvite(): void {
    this.isOpened = true;
    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
      const dialogRef = this.dialog.open(InviteDialog);

      dialogRef.afterClosed().subscribe(() => {
        this.isOpened = false;
      });
    }, 2000);
  }
}
