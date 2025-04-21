import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

import { MatDialogContent } from "@angular/material/dialog";
import { filter } from "rxjs";

@Component({
  selector: 'invite-body-dialog',
  standalone: true,
  templateUrl: './invite-body.component.html',
  styleUrl: './invite-body.component.scss',
  imports: [MatDialogContent],
})
export class InviteDialog implements OnInit {
  isPadrinho: boolean = false;
  alias: string = 'padrinho';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkPadrinho();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkPadrinho();
    });
  }

  checkPadrinho(): void {
    const urlAtual = this.router.url;

    this.isPadrinho = urlAtual.includes(this.alias)
  }
}
