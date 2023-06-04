import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from "@ngrx/store";
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { AppService } from './services/app.service';
import { changeNextSongTitle } from './store/app.actions';
import { ConfigService } from './services/config.service';

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
  title = 'mixtrack-web';

  app$: Observable<{playlistOpenState: boolean, playlistStyle: {bottom: string}, loaderStyle: {opacity: number}, isLoaded: boolean}>;

  isLoaded: boolean = false;

  loaderStyle: {opacity: number} = {opacity: 1};

  playlistPanelStyle = {bottom: "-100vh"};

  playlistOpenState = false;

  constructor (private config: ConfigService, private store: Store<{app: { isLoaded: boolean, playlistOpenState: boolean, playlistStyle: {bottom: string}, loaderStyle: {opacity: number}}}>, private http: HttpClient, private auth: AuthService, private app: AppService) {
    this.app$ = store.select("app");

    this.app$.subscribe({
      next: (state) => {
        this.isLoaded = state.isLoaded;
        this.loaderStyle = state.loaderStyle;
        this.playlistOpenState = state.playlistOpenState;
        this.playlistPanelStyle = state.playlistStyle;
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
      
        const IndexOfActive = data.playlists.findIndex(obj => obj.isActive === true);

        if (!data.playlists[IndexOfActive].songs[0]) {

          this.store.dispatch(changeNextSongTitle({title: "No songs in playlist"}));

        } else {

          this.store.dispatch(changeNextSongTitle({title: data.playlists[IndexOfActive].songs[0].title}));

        }

      },
      error: (error) => {
        console.log(error);
      }
    });

  }

}