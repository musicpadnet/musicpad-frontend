import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IRoomData, RoomService } from 'src/app/services/room.service';
import { ChangePlaylistPanel, changePlaylistOpenState } from 'src/app/store/app.actions';

@Component({
  selector: 'm-app-view-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  
  roomName: string | null = null;

  roomDJ: string | null = null;

  nextSongtitle: string | null = null;

  pfp: string = "null";

  roomIsLoaded = false;

  roomLoaderStyle = {height: "100%"};

  loaderStyle = {opacity: 1};

  username: string = "null";

  app$: Observable<{nextSongTitle: string, username: string, pfp: string, playlistStyle: {bottom: string}, playlistOpenState: boolean}>;

  constructor (private room: RoomService, private store: Store<{app: {username: string, pfp: string, nextSongTitle: string, playlistStyle: {bottom: string}, playlistOpenState: boolean}}>) {

    this.app$ = store.select("app");

    this.app$.subscribe({
      next: (state) => {
        this.nextSongtitle = state.nextSongTitle;
        this.username = state.username;
        this.pfp = state.pfp;
      }
    });

  }

  openPlaylistPanel () {

    this.store.dispatch(changePlaylistOpenState({open: true}));

    setTimeout(() => {

      this.store.dispatch(ChangePlaylistPanel({style: {bottom: "0"}}));

    }, 1);

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

  ngOnDestroy() {

    this.store.dispatch(ChangePlaylistPanel({style:{bottom: "-100vh"}}));

  }

}
