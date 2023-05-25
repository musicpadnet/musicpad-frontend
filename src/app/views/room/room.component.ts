import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IRoomData, RoomService } from 'src/app/services/room.service';
import { ChangePlaylistPanel } from 'src/app/store/app.actions';

@Component({
  selector: 'm-app-view-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  
  roomName: string | null = null;

  roomDJ: string | null = null;

  playlistPanelStyle = {bottom: "-100vh"};

  app$: Observable<{playlistStyle: {bottom: string}}>;

  constructor (private room: RoomService, private store: Store<{app: {playlistStyle: {bottom: string}}}>) {

    this.app$ = store.select("app");

    this.app$.subscribe({
      next: (state) => {
        this.playlistPanelStyle = state.playlistStyle;
      }
    });

  }

  openPlaylistPanel () {

    this.store.dispatch(ChangePlaylistPanel({style: {bottom: "0"}}));

  }

  ngOnInit() {
    
    this.room.fetchRoom(window.location.pathname.slice(1, window.location.pathname.length)).then((data: IRoomData) => {

      this.roomName = data.name;

      if (data.current_dj.user === null) {
        this.roomDJ = "current dj: none";
      }

    }).catch(err => {
      console.log(err);
    });

  }

  ngOnDestroy() {

    this.store.dispatch(ChangePlaylistPanel({style:{bottom: "-100vh"}}));

  }

}
