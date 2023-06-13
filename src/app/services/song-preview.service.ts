import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { changePreviewStyle } from "../store/app.actions";

@Injectable({
  providedIn: "root"
})
export class SongPrevService {

  constructor (private store: Store) {}

  yt: any;

  openPlayer (cid: string) {

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

    this.store.dispatch(changePreviewStyle({style: {display: "none"}}));

  }

}