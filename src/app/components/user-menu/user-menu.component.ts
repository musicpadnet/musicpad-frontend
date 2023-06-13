import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'm-app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {

  app$: Observable<{username: string}>

  username = "null";

  constructor (private store: Store<{app: {username: string}}>, private auth: AuthService) {
    this.app$ = this.store.select("app");

    this.app$.subscribe({
      next: (state) => {
        this.username = state.username;
      }
    })
  }

  onClickLogout () {

    this.auth.logout();

    setTimeout(() => {

      location.reload();

    }, 1);

  }

}
