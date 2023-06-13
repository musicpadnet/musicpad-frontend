import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';
import { SingupDialogComponent } from 'src/app/components/signup-dialog/signup-dialog.component';
import { IRoomData, RoomService } from 'src/app/services/room.service';
import { ChangePlaylistPanel, changePlaylistOpenState, changeUserMenuOpen, changeUserMenuStyle } from 'src/app/store/app.actions';
import { changeRoomIsOpen, changeRoomMenuStyle } from 'src/app/store/room.actions';

@Component({
  selector: 'm-app-view-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  tabToOpen: string = "room";
  
  roomName: string | null = null;

  roomDJ: string | null = null;

  nextSongtitle: string | null = null;

  pfp: string = "null";

  roomIsLoaded = false;

  roomLoaderStyle = {height: "100%"};

  loaderStyle = {opacity: 1};

  username: string = "null";

  userMenuIsOpen = false;

  loggedIn = false;

  roomMenuStyle = {top: "-100vh"};

  roomMenuIsOpen = false;

  app$: Observable<{loggedIn: boolean, nextSongTitle: string, userMenuIsOpen: boolean, username: string, pfp: string, playlistStyle: {bottom: string}, playlistOpenState: boolean}>;

  room$: Observable<{roomMenuStyle: {top: string}, roomMenuIsOpen: boolean}>;

  constructor (public dialog: MatDialog, private room: RoomService, private store: Store<{app: {username: string, userMenuIsOpen: boolean, pfp: string, nextSongTitle: string, playlistStyle: {bottom: string}, playlistOpenState: boolean, loggedIn: boolean}, room: {roomMenuStyle: {top: string}, roomMenuIsOpen: boolean}}>) {

    this.app$ = store.select("app");

    this.room$ = store.select("room");

    this.app$.subscribe({
      next: (state) => {
        this.nextSongtitle = state.nextSongTitle;
        this.username = state.username;
        this.pfp = state.pfp;
        this.userMenuIsOpen = state.userMenuIsOpen;
        this.loggedIn = state.loggedIn;
      }
    });

    this.room$.subscribe({
      next: (state) => {
        this.roomMenuStyle = state.roomMenuStyle;
        this.roomMenuIsOpen = state.roomMenuIsOpen;
      }
    });

  }

  openPlaylistPanel () {

    if (this.loggedIn === true) {

      this.store.dispatch(changePlaylistOpenState({open: true}));

      setTimeout(() => {

        this.store.dispatch(ChangePlaylistPanel({style: {bottom: "0"}}));

      }, 1);

    } else {

      this.openSignupDialog();

    }

  }

  openLoginDialog () {

    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '420px'
    });

  }

  openSignupDialog () {

    const dialogRef = this.dialog.open(SingupDialogComponent, {
      width: '420px'
    });

  }

  ngOnInit() {

    document.title = "Connecting...";
    
    this.room.fetchRoom(window.location.pathname.slice(1, window.location.pathname.length)).then((data: IRoomData) => {

      this.roomName = data.name;

      if (data.current_dj.user === null) {
        this.roomDJ = "current dj: LIFELINE";
      }

      setTimeout(() => {

        document.title = `Musicpad - ${data.name}`;

        this.roomLoaderStyle = {height: "0%"};

        this.loaderStyle = {opacity: 0};

          setTimeout(() => {

            this.roomIsLoaded = true;
  
          }, 2000);

      }, 2500);

    }).catch(err => {
      console.log(err);
    });

  }

  onClickUserMenu () {

    if (this.userMenuIsOpen === true) {

      this.store.dispatch(changeUserMenuStyle({style: {right: "-300px"}}));

      setTimeout(() => {

        this.store.dispatch(changeUserMenuOpen({isOpen: false}));

      }, 300);

    } else {

      this.store.dispatch(changeUserMenuOpen({isOpen: true}));

      setTimeout(() => {

        this.store.dispatch(changeUserMenuStyle({style: {right: "0"}}))

      }, 100);

    }

  }

  toggleRoomMenu () {

    if (this.roomMenuIsOpen === true) {

      this.store.dispatch(changeRoomMenuStyle({style: {top: "-100vh"}}));

      setTimeout(() => {

        this.store.dispatch(changeRoomIsOpen({isOpen: false}));

      }, 300);

    } else {

      this.tabToOpen = "room";

      this.store.dispatch(changeRoomIsOpen({isOpen: true}));

      setTimeout(() => {
        
        this.store.dispatch(changeRoomMenuStyle({style: {top: "50px"}}))

      }, 1);

    }

  }

  toggleRoomMenuHistory () {

    if (this.roomMenuIsOpen === true) {

      this.store.dispatch(changeRoomMenuStyle({style: {top: "-100vh"}}));

      setTimeout(() => {

        this.store.dispatch(changeRoomIsOpen({isOpen: false}));

      }, 300);

    } else {

      this.tabToOpen = "history";

      this.store.dispatch(changeRoomIsOpen({isOpen: true}));

      setTimeout(() => {
        
        this.store.dispatch(changeRoomMenuStyle({style: {top: "50px"}}))

      }, 1);

    }

  }

  toggleRoomMenuRooms () {

    if (this.roomMenuIsOpen === true) {

      this.store.dispatch(changeRoomMenuStyle({style: {top: "-100vh"}}));

      setTimeout(() => {

        this.store.dispatch(changeRoomIsOpen({isOpen: false}));

      }, 300);

    } else {

      this.tabToOpen = "rooms";

      this.store.dispatch(changeRoomIsOpen({isOpen: true}));

      setTimeout(() => {
        
        this.store.dispatch(changeRoomMenuStyle({style: {top: "50px"}}))

      }, 1);

    }

  }

  ngOnDestroy() {

    this.store.dispatch(ChangePlaylistPanel({style:{bottom: "-100vh"}}));

    this.store.dispatch(changeRoomMenuStyle({style: {top: "-100vh"}}));

    setTimeout(() => {

      this.store.dispatch(changeRoomIsOpen({isOpen: false}));

    }, 300);

  }

}
