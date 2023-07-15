import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { changeUserAccountSettingsMenuOpen, changeUserAccountSettingsMenuStyle } from 'src/app/store/app.actions';
import { ChangeAvatarDialog } from '../change-avatar-dialog/change-avatar-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'm-app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {

  app$: Observable<{username: string, userAccountSettingsMenuOpen: boolean}>

  username = "null";

  isAccountSettingsMenuOpen = false;

  constructor (private store: Store<{app: {userAccountSettingsMenuOpen: boolean, username: string}}>, private auth: AuthService, private dialog: MatDialog) {
    this.app$ = this.store.select("app");

    this.app$.subscribe({
      next: (state) => {
        this.username = state.username;
        this.isAccountSettingsMenuOpen = state.userAccountSettingsMenuOpen;
      }
    })
  }

  onClickSettingsAccountMenu () {

    if (this.isAccountSettingsMenuOpen === true) {

      this.store.dispatch(changeUserAccountSettingsMenuOpen({isOpen: false}));

      this.store.dispatch(changeUserAccountSettingsMenuStyle({style: {right: "-250px"}}));

    } else {

      this.store.dispatch(changeUserAccountSettingsMenuOpen({isOpen: true}));

      this.store.dispatch(changeUserAccountSettingsMenuStyle({style: {right: "250px"}}));

    }

  }

  onClickLogout () {

    this.auth.logout();

    setTimeout(() => {

      location.reload();

    }, 1);

  }

}
