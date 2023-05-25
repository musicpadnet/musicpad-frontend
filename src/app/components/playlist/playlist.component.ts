import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { ChangePlaylistPanel, UpdatePlaylists } from 'src/app/store/app.actions';
import { OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePlaylistDialog } from '../create-playlist-dialog/create-playlist-dialog.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface ISearchItem {
  cid: string,
  title: string,
  thumbnail: string,
  duration: number,
  unavailable: boolean
}

@Component({
  selector: 'm-app-playlist-panel',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {

  playlists: {name: string, isActive: boolean, id: string, songCount: number}[] = [];

  app$: Observable<{playlists: {name: string, isActive: boolean, id: string, songCount: number}[]}>;

  SearchForm: FormGroup;

  ytsngs: ISearchItem[] | any[] = [];

  constructor(private store: Store<{app: {playlists: {name: string, isActive: boolean, id: string, songCount: number}[]}}>, public dialog: MatDialog, private http: HttpClient, private config: ConfigService) {

    this.app$ = store.select("app");

    this.app$.subscribe({
      next: (state) => {
        this.playlists = state.playlists
      }
    });

    this.SearchForm = new FormGroup({
      'search': new FormControl(null, [Validators.required, Validators.maxLength(400)])
    });

  }

  makeTime (seconds: number): string {
      
    const hours   = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60) % 60;
    const secs = seconds % 60;
  
    return [hours,minutes,secs]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")

  }
 
  OnSubmit () {

    if (this.SearchForm.valid) {

      const collection = document.getElementsByClassName("playlist-panels");

      for (let i = 0; i < collection.length; i++) {
        // @ts-ignore
        collection[i].style.display = "none";
      }

      // @ts-ignore
      document.getElementById("yt-search").style.display = "block";

      this.http.get<ISearchItem[]>(`${this.config.conifgAPIURL}playlists/search/yt?`, {
        params: {
          q: this.SearchForm.value.search
        },
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
        }
      }).subscribe({
        next: (data) => {
          this.ytsngs = data;
        },
        error: (error) => {
          console.log(error);
        }
      })

    }

  }

  closePlaylistPanel () {
    this.store.dispatch(ChangePlaylistPanel({style: {bottom: "-100vh"}}));
  }

  playlistClick (playlistid: string) {

    this.ytsngs = [];

    const collection = document.getElementsByClassName("playlist-panels");

    for (let i = 0; i < collection.length; i++) {
      // @ts-ignore
      collection[i].style.display = "none";
    }

    // @ts-ignore
    const c = document.getElementsByClassName("p-i");

    for (let i = 0; i < c.length; i++) {
      //@ts-ignore
      c[i].style.backgroundColor = "transparent";
      // @ts-ignore
      c[i].style.color = "#ffffff";
    }

    // @ts-ignore
    document.getElementById("play"+playlistid).style.backgroundColor = "#A36CFE";

    // @ts-ignore
    document.getElementById("play"+playlistid).style.color = "#ffffff";

    //@ts-ignore
    document.getElementById(playlistid).style.display = "block";

  }

  ngOnInit() {

    this.http.get<{playlists: {name: string, isActive: boolean, id: string, songCount: number}[]}>(`${this.config.conifgAPIURL}playlists`, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
      }
    }).subscribe({
      next: (data) => {

        this.store.dispatch(UpdatePlaylists({playlists: data.playlists}));

      },
      error: (error) => {
        console.log("error while fetching playlists");
      }
    });

  }

  openCreateDialog () {
    const dialogRef = this.dialog.open(CreatePlaylistDialog, {
      width: '420px'
    });
  }

}
