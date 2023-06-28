import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';

export interface IRoomData {
  current_dj: {
    user: {
      username: string,
      id: string,
      pfp: string
    },
    song: {
      title: string,
      duration: number,
      time: number,
      upvotes: number,
      downvotes: number,
      thumbnail: string,
      grabs: number,
      cid: string
    }
  },
  users: string[],
  id: string,
  name: string,
  slug: string,
  queue_cycle?: boolean,
  queue_locked?: boolean,
  welcome_message?: string,
  description?: string,
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  yt: any;

  constructor(private http: HttpClient, private router: Router, private config: ConfigService) { }

  fetchRoom (slug: string): Promise<IRoomData> {

    const promise = new Promise<IRoomData>((resolve, reject) => {

      this.http.get<IRoomData>(`${this.config.conifgAPIURL}rooms/@/${slug}`).subscribe({
        next: (data: IRoomData) => {
          resolve(data);
        },
        error: (error) => {
          
          if (error.status === 404) {

            this.router.navigate(["/"]);

          }

          reject(error);

        }

      });

    });

    return promise;

  }

  destoryPlayer () {

    this.yt.destroy();

    this.yt = null;

  }

  getYTPlayerExists (): boolean {

    if (this.yt) {
      return true
    } else {
      return false;
    }

  }

  mutePlayer () {

    this.yt.mute();

  }

  unmutePlayer () {

    this.yt.unMute();

  }

  startPlayer (cid: string, time: number | null) {

    const onPlayerReady = (event: any) => {

      event.target.seekTo(time);

      event.target.playVideo();

    }

    const onPlayerStateChange = (event: any) => {

      if (this.yt.getPlayerState() === 2) {

        event.target.playVideo();

      }

    }

    // @ts-ignore
    this.yt = new YT.Player("roomplayer", {
      height: '455',
      width: '807',
      videoId: cid,
      playerVars: {
        'controls': 0,       //Disable controls
				'iv_load_policy': 3, //Disable annotations
				'showinfo': 0,       //Disable video info
			  'autoplay': 1,	   //Enable autoplay
				'fs': 0,             //Disable fullscreen
				'rel': 0,            //Disable showing related videos
				'disablekb': 1,      //Disable keyboard
        'start': time
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });

  }

}
