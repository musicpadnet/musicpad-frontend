import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from "@ngrx/store";
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { AppService } from './services/app.service';
import { changeNextSongTitle, changeUserAccountSettingsMenuOpen, changeUserAccountSettingsMenuStyle, changeUserMenuOpen, changeUserMenuStyle } from './store/app.actions';
import { ConfigService } from './services/config.service';
import { SongPrevService } from './services/song-preview.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangeAvatarDialog } from './components/change-avatar-dialog/change-avatar-dialog.component';

interface ILibSong {
  title: string,
  cid: string,
  type: string,
  duration: number,
  thumbnail: string,
  unavailable: boolean,
  _id: string
}

@Component({
  selector: 'm-app-mount',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  app$: Observable<{prevStyle: {display: string}, loggedIn: boolean, userMenuIsOpen: boolean, userMenuStyle: {right: string}, playlistOpenState: boolean, appIsReady: boolean, playlistStyle: {bottom: string}, loaderStyle: {opacity: number}, isLoaded: boolean, userAccountSettingsMenuStyle: {right: string}, userAccountSettingsMenuOpen: boolean}>;

  isLoaded: boolean = false;

  loaderStyle: {opacity: number} = {opacity: 1};

  playlistPanelStyle = {bottom: "-100vh"};

  playlistOpenState = false;

  userMenuStyle = {right: "-300px"};

  loggedIn = false;

  appReady = false;

  userMenuIsOpen = false;

  prevStyle = {display: "none"};

  subMenuStyle = {right: "-250px"};

  subMenuOpen = false;

  backDropStyle = {width: "calc(100vw - 250px)"};

  constructor (private songprev: SongPrevService, private config: ConfigService, private store: Store<{app: { prevStyle: {display: string}, userMenuStyle: {right: string}, appIsReady: boolean, isLoaded: boolean, playlistOpenState: boolean, playlistStyle: {bottom: string}, loaderStyle: {opacity: number}, loggedIn: boolean, userMenuIsOpen: boolean, userAccountSettingsMenuStyle: {right: string}, userAccountSettingsMenuOpen: boolean}}>, private http: HttpClient, private auth: AuthService, private app: AppService, private dialog: MatDialog) {
    this.app$ = store.select("app");

    this.app$.subscribe({
      next: (state) => {
        this.isLoaded = state.isLoaded;
        this.loaderStyle = state.loaderStyle;
        this.playlistOpenState = state.playlistOpenState;
        this.playlistPanelStyle = state.playlistStyle;
        this.appReady = state.appIsReady;
        this.loggedIn = state.loggedIn;
        this.userMenuStyle = state.userMenuStyle;
        this.userMenuIsOpen = state.userMenuIsOpen;
        this.prevStyle = state.prevStyle;
        this.subMenuStyle = state.userAccountSettingsMenuStyle;
        this.subMenuOpen = state.userAccountSettingsMenuOpen;

        if (this.subMenuOpen === true) {

          this.backDropStyle = {width: "calc(100vw - 500px)"};

        } else {

          this.backDropStyle = {width: "calc(100vw - 250px)"};

        }
      }
    })
    
  }

  async ngOnInit(): Promise<void> {

    await this.app.initiateApplicationCoreBundles();

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    this.http.get<{playlists: {name: string, isActive: boolean, id: string, songCount: number, songs: ILibSong[]}[]}>(`${this.config.conifgAPIURL}playlists`, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
      }
    }).subscribe({
  
      next: (data) => {

        if (!data.playlists[0]) {

          this.store.dispatch(changeNextSongTitle({title: "Create a playlist to play music!!!"}));

        } else {

          const IndexOfActive = data.playlists.findIndex(obj => obj.isActive === true);

          if (!data.playlists[IndexOfActive].songs[0]) {
  
            this.store.dispatch(changeNextSongTitle({title: "No songs in playlist"}));
  
          } else {
  
            this.store.dispatch(changeNextSongTitle({title: data.playlists[IndexOfActive].songs[0].title}));
  
          }

        }

      },
      error: (error) => {
        console.log(error);
      }
    });

  }

  openChangeAvatarDialog () {

    this.store.dispatch(changeUserMenuStyle({style: {right: "-300px"}}));

    this.store.dispatch(changeUserMenuOpen({isOpen: false}));

    this.store.dispatch(changeUserAccountSettingsMenuOpen({isOpen: false}));

    this.store.dispatch(changeUserAccountSettingsMenuStyle({style: {right: "-250px"}}));

    const dialogRef = this.dialog.open(ChangeAvatarDialog, {
      width: '420px'
    });

  }

  closeUserMenu () {

    this.store.dispatch(changeUserMenuStyle({style: {right: "-300px"}}));

    this.store.dispatch(changeUserMenuOpen({isOpen: false}));

    this.store.dispatch(changeUserAccountSettingsMenuOpen({isOpen: false}));

    this.store.dispatch(changeUserAccountSettingsMenuStyle({style: {right: "-250px"}}));

  }

  closePreview () {

    this.songprev.closePlayer();

  }

}