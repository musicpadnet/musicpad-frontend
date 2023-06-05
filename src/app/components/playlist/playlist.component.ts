import { Component, ViewChildren, QueryList, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Store } from "@ngrx/store";
import { ChangePlaylistPanel, UpdatePlaylists, changeNextSongTitle, changePlaylistOpenState } from 'src/app/store/app.actions';
import { MatDialog } from '@angular/material/dialog';
import { CreatePlaylistDialog } from '../create-playlist-dialog/create-playlist-dialog.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash-es';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DeletePlaylistDialog } from '../delete-playlist-dialog/delete-playlist-dialog.component';
import { RenamePlaylistDialog } from '../rename-playlist-dialog/rename-playlist-dialog.component';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ImportPlaylistDialog } from '../import-playlist-dialog/import-playlist-dialog.component';

interface ISearchItem {
  cid: string,
  title: string,
  thumbnail: string,
  duration: number,
  unavailable: boolean
}

interface ILibSong {
  title: string,
  cid: string,
  type: string,
  duration: number,
  thumbnail: string,
  unavailable: boolean,
  _id: string
}

interface ISongsReq {
  prev: number | null,
  next: number | null,
  totalPages: number,
  items: ILibSong[]
}

@Component({
  selector: 'm-app-playlist-panel',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {

  @ViewChildren("plfldr") fldrelms!: QueryList<ElementRef>;

  @ViewChildren("pp") pps!: QueryList<ElementRef>;

  @ViewChild("scrollCont") scrollContElm!: CdkVirtualScrollViewport;

  playlists: {name: string, isActive: boolean, id: string, songCount: number, songs: ILibSong[]}[] = [];

  playlistsSongs: {id: string, items: ILibSong[]}[] | any[] = [];

  app$: Observable<{playlists: {name: string, isActive: boolean, id: string, songCount: number, songs: ILibSong[]}[]}>;

  player: any;

  plfl: ElementRef[] = [];
  
  ppss: ElementRef[] = []

  SearchForm: FormGroup;

  ytsngs: ISearchItem[] | any[] = [];

  previewStyle = {display: "none"};

  playlistLoaderStyle = {display: "none"};

  ytpanelStyle = {display: "none"};

  sQuery: string | null = null;

  openPlaylist: string | null | undefined = null;

  constructor(private store: Store<{app: {playlists: {name: string, isActive: boolean, id: string, songCount: number, songs: ILibSong[]}[]}}>, public dialog: MatDialog, private http: HttpClient, private config: ConfigService, private snackBar: MatSnackBar) {

    this.app$ = store.select("app");

    this.app$.subscribe({
      next: (state) => {
        this.playlists = state.playlists;
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

      this.sQuery = null;

      this.ytsngs = [];

      this.playlistLoaderStyle = {display: "block"};

      this.ytpanelStyle = {display: "block"};

      // @ts-ignore
      const c = document.getElementsByClassName("p-i");

      for (let i = 0; i < c.length; i++) {
        //@ts-ignore
        c[i].style.backgroundColor = "transparent";
        // @ts-ignore
        c[i].style.color = "#ffffff";
      }

      this.openPlaylist = "ytsearch";

      this.http.get<ISearchItem[]>(`${this.config.conifgAPIURL}playlists/search/yt?`, {
        params: {
          q: this.SearchForm.value.search
        },
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
        }
      }).subscribe({
        next: (data) => {
          this.sQuery = `Results for "${this.SearchForm.value.search}"`;
          this.SearchForm.controls["search"].reset();
          this.playlistLoaderStyle = {display: "none"};
          this.ytsngs = data;
        },
        error: (error) => {
          console.log(error);
        }
      })

    }

  }

  onClickActivatePlaylist (playlistid: string) {

    this.http.patch(`${this.config.conifgAPIURL}playlists/activate/${playlistid}`, null, {
      headers: {
        authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
      }
    }).subscribe({
      next: (data) => {

        let temp = cloneDeep(this.playlists);

        const indexOfCurrentActive = temp.findIndex(obj => obj.isActive === true);

        if (temp[indexOfCurrentActive]) {

          temp[indexOfCurrentActive].isActive = false;

        }

        const indexOfNewActive = temp.findIndex(obj => obj.id === playlistid);

        temp[indexOfNewActive].isActive = true;

        this.store.dispatch(UpdatePlaylists({playlists: temp}));

      },
      error: (error) => {
        console.log(error);
      }
    })

  }

  openPreview (cid: string) {

    this.previewStyle = {"display": "block"};

    const onPlayerReady = (event: any) => {

      event.target.playVideo();

    }

    // @ts-ignore
    this.player = new YT.Player("preplayer", {
      height: '390',
      width: '640',
      videoId: cid,
      playerVars: {
        'playsinline': 1
      },
      events: {
        'onReady': onPlayerReady
      }
    })

  }

  closePreview () {

    this.player.destroy();

    this.player = null;

    this.previewStyle = {display: "none"};

  }

  closePlaylistPanel () {

    if (window.location.pathname === "/") {

      this.store.dispatch(ChangePlaylistPanel({style: {bottom: "-100vh", width: "100%"}}));
      setTimeout(() => {

        this.store.dispatch(changePlaylistOpenState({open: false}));

      }, 500);

    } else {

      this.store.dispatch(ChangePlaylistPanel({style: {bottom: "-100vh"}}));
      setTimeout(() => {

        this.store.dispatch(changePlaylistOpenState({open: false}));

      }, 500);

    }

  }

  playlistClick (playlistid: string) {

    window.localStorage.setItem("lastclickedpl", playlistid);

    this.openPlaylist = playlistid;

    this.ytpanelStyle = {display: "none"};

    this.ytsngs = [];

    // @ts-ignore
    const c = document.getElementsByClassName("p-i");

    for (let i = 0; i < c.length; i++) {
      //@ts-ignore
      c[i].style.backgroundColor = "transparent";
      // @ts-ignore
      c[i].style.color = "#ffffff";
    }

    const collection = document.getElementsByClassName("playlist-panels");

    for (let i = 0; i < collection.length; i++) {
      // @ts-ignore
      collection[i].style.display = "none";
    }

    //@ts-ignore
    document.getElementById(playlistid).style.display = "block";

    // @ts-ignore
    document.getElementById("play"+playlistid).style.backgroundColor = "#0075d5";

    // @ts-ignore
    document.getElementById("play"+playlistid).style.color = "#ffffff";

  }

  ngOnInit() {

    const lastActivepl1 = window.localStorage.getItem("lastclickedpl");

    if (lastActivepl1) {
      this.openPlaylist = lastActivepl1;
    }

    this.http.get<{playlists: {name: string, isActive: boolean, id: string, songCount: number, songs: ILibSong[]}[]}>(`${this.config.conifgAPIURL}playlists`, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
      }
    }).subscribe({
      next: (data) => {

        this.store.dispatch(UpdatePlaylists({playlists: data.playlists}));

        const IndexOfActive = data.playlists.findIndex(obj => obj.isActive === true);

        if (!data.playlists[IndexOfActive].songs[0]) {

          this.store.dispatch(changeNextSongTitle({title: "No songs in playlist"}));

        } else {

          this.store.dispatch(changeNextSongTitle({title: data.playlists[IndexOfActive].songs[0].title}));

        }

        this.fldrelms.changes.subscribe({
          next: (data) => {

            this.pps.changes.subscribe({
              next: (data2) => {

                const IndexOfActive = this.playlists.findIndex(obj => obj.isActive === true);

                if (!this.playlists[IndexOfActive].songs[0]) {

                    this.store.dispatch(changeNextSongTitle({title: "No songs in playlist"}));

                } else {

                    this.store.dispatch(changeNextSongTitle({title: this.playlists[IndexOfActive].songs[0].title}));

                }

                const lastActivepl = window.localStorage.getItem("lastclickedpl");

                if (lastActivepl) {

                  let elm1:any;

                  let elm2:any;

                  data.forEach((elm: ElementRef) => {

                    if (elm.nativeElement.dataset.id === lastActivepl) {

                      elm1 = elm.nativeElement;

                    }

                  });

                  this.openPlaylist = lastActivepl;

                  data2.forEach((elm: ElementRef) => {

                    if (elm.nativeElement.dataset.id === lastActivepl) {

                      elm2 = elm.nativeElement;

                    }

                  });

                  elm1.style.backgroundColor = "#0075d5";

                  elm2.style.display = "block";

                }

              },
              error: (error) => {

              }
            })

          },
          error: (error) => {
            console.log(error);
          }
        });

        /*if (lastActivepl) {

          // @ts-ignore
          document.getElementById("play"+lastActivepl).style.backgroundColor = "#0075d5";

          // @ts-ignore
          document.getElementById("play"+lastActivepl).style.color = "#ffffff";

          //@ts-ignore
          document.getElementById(lastActivepl).style.display = "block";

        }*/

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

  openDeletePLDialog (playlistid: string) {
    const dialogRef = this.dialog.open(DeletePlaylistDialog, {
      width: '420px',
      data: {
        playlistid: playlistid
      }
    });
  }

  openRenamePLDialog (playlistid: string) {
    const dialogRef = this.dialog.open(RenamePlaylistDialog, {
      width: '420px',
      data: {
        playlistid: playlistid
      }
    });
  }

  onClickAdd(cid: string, playlistid: string) {

    this.http.put<{song: ILibSong}>(`${this.config.conifgAPIURL}playlists/${playlistid}/song/${cid}`, null, {
      headers: {
        authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
      }
    }).subscribe({
      next: (data) => {

        let temp = cloneDeep(this.playlists);

        const index = temp.findIndex(obj => {

          // @ts-ignore
          return obj.id === playlistid;

        });

        temp[index].songs.push(data.song);

        temp[index].songCount++;

        const collection = document.getElementsByClassName("playlist-panels");

        for (let i = 0; i < collection.length; i++) {
          // @ts-ignore
          collection[i].style.display = "none";
        }

        this.store.dispatch(UpdatePlaylists({playlists: temp}));

        this.AlertAddedSong();
      },
      error: (err) => {

        console.log(err);
        
        if (err.error.message === "Maxiumum songs in a playlist reached") {

          this.AlertTooManySongs();

        } else {

          this.AlertUnknownError();

        }

      }
    })

  }

  async onClickDeleteSong (songr: HTMLDivElement) {

    const playlistid = songr.dataset["id"];

    this.http.delete(`${this.config.conifgAPIURL}playlists/${songr.dataset["id"]}/songs/${songr.dataset["cid"]}`, {
      headers: {
        authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
      }
    }).subscribe({
      next: (data) => {
        
        let temp = cloneDeep(this.playlists);

        const index = temp.findIndex(obj => {

          // @ts-ignore
          return obj.id === playlistid;

        });

        if (songr.dataset["cid"]) {

          let remIndex = temp[index].songs.map(item => item._id).indexOf(songr.dataset["cid"]);

          console.log(remIndex);

          temp[index].songs.splice(remIndex, 1);

          temp[index].songCount = temp[index].songCount - 1;

          console.log(temp);

          this.store.dispatch(UpdatePlaylists({playlists: temp}));

          // @ts-ignore
          document.getElementById("play"+playlistid).style.backgroundColor = "#0075d5";

          // @ts-ignore
          document.getElementById("play"+playlistid).style.color = "#ffffff";

          this.openPlaylist = playlistid;


        }

      },
      error: (error) => {
        console.log(error);
      }
    })

  }

  onClickMoveBottom (songr: HTMLDivElement) {

    const playlistid = songr.dataset["id"];

    const songid = songr.dataset["cid"];

    if (songr.dataset["id"] && songr.dataset["cid"]) {

      const temp = cloneDeep(this.playlists);

      const index = temp.findIndex(obj => obj.id === playlistid);

      const toIndex = temp[index].songCount - 1

      this.http.put(`${this.config.conifgAPIURL}playlists/${playlistid}/${songid}/move/${toIndex}`, null, {
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
        }
      }).subscribe({
        next: (data) => {

          const fromIndex = temp[index].songs.findIndex(obj => obj._id === songid);

          let elm = temp[index].songs.splice(fromIndex, 1)[0];

          temp[index].songs.splice(toIndex, 0, elm);

          this.store.dispatch(UpdatePlaylists({playlists: temp}));

        },
        error: (error) => {

          console.log(error);

        }
      })

    }

  }

  onClickMoveTop (songr: HTMLDivElement) {

    const playlistid = songr.dataset["id"];

    const songid = songr.dataset["cid"];

    if (songr.dataset["cid"] && songr.dataset["id"]) {

      this.http.put(`${this.config.conifgAPIURL}playlists/${playlistid}/${songid}/movetop`, null, {
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
        }
      }).subscribe({
        next: (data) => {
          
          const temp = cloneDeep(this.playlists);

          const index = temp.findIndex(obj => {

            // @ts-ignore
            return obj.id === playlistid;
  
          });

          const fromIndex = temp[index].songs.findIndex(obj => obj._id === songid);

          const toIndex = 0;

          let elem = temp[index].songs.splice(fromIndex, 1)[0];

          temp[index].songs.splice(toIndex, 0, elem);

          this.store.dispatch(UpdatePlaylists({playlists: temp}));

        },
        error: (error) => {
          console.log(error);
        }
      })

    }

  }

  moveDrop(event: CdkDragDrop<string[]>) {

    let currentPos = this.scrollContElm.measureScrollOffset("top");

    const playlistid = event.item.element.nativeElement.dataset["id"];

    const songid = event.item.element.nativeElement.dataset["cid"];

    if (playlistid && songid) {

      this.http.put(`${this.config.conifgAPIURL}playlists/${playlistid}/${songid}/move/${event.currentIndex}`, null, {
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
        }
      }).subscribe({
        next: () => {

          const temp = cloneDeep(this.playlists);

          const index = temp.findIndex(obj => obj.id === playlistid);

          const fromIndex = temp[index].songs.findIndex(obj => obj._id === songid);

          const toIndex = event.currentIndex;

          let elm = temp[index].songs.splice(fromIndex, 1)[0];

          temp[index].songs.splice(toIndex, 0, elm);

          this.playlists = temp;

          this.store.dispatch(UpdatePlaylists({playlists: temp}));

          setTimeout(() => {

            this.scrollContElm.scrollTo({top: currentPos});

          }, 1);

        },
        error: (error) => {

          console.log(error);

        }
      })

    }

  }

  openImportPlaylistDialog () {
    const dialogRef = this.dialog.open(ImportPlaylistDialog, {
      width: '420px'
    });
  }

  AlertAddedSong() {
    let snack = this.snackBar.open("Added song to playlist!!", "", {
      panelClass: ['success-snack']
    });
    setTimeout(() => {
      snack.dismiss();
    }, 4000)
  }

  AlertTooManySongs () {

    let snack = this.snackBar.open("Maximum songs in playlist reached :(", "", {
      panelClass: ['error-snack']
    });
    setTimeout(() => {
      snack.dismiss();
    }, 4000);

  }

  AlertUnknownError () {

    let snack = this.snackBar.open("An Unknown Error Occurred :(", "", {
      panelClass: ['error-snack']
    });
    setTimeout(() => {
      snack.dismiss();
    }, 4000)

  }

}
