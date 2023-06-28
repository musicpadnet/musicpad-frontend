import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { changePreviewStyle } from "../store/app.actions";
import { RoomService } from "./room.service";

@Injectable({
  providedIn: "root"
})
export class SongPrevService {

  constructor (private store: Store, private room: RoomService) {}

  yt: any;

  openPlayer (cid: string) {

    if (this.room.getYTPlayerExists()) {
      this.room.mutePlayer();
    }

    this.store.dispatch(changePreviewStyle({style: {display: "block"}}));

    const onPlayerReady = (event: any) => {

      event.target.playVideo();

    }

    // @ts-ignore
    this.yt = new YT.Player("preplayer", {
      height: '390',
      width: '640',
      videoId: cid,
      playerVars: {
        'playsinline': 1
      },
      events: {
        'onReady': onPlayerReady
      }
    });

  }

  closePlayer () {

    this.yt.destroy();

    if (this.room.getYTPlayerExists()) {
      this.room.unmutePlayer();
    }

    this.store.dispatch(changePreviewStyle({style: {display: "none"}}));

  }

}