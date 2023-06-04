import { HttpClient } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { ConfigService } from "src/app/services/config.service";
import { UpdatePlaylists } from "src/app/store/app.actions";
import { cloneDeep } from "lodash-es";

interface IPlaylstItem {
  title: string,
  cid: string,
  type: string,
  duration: number,
  thumbnail: string,
  unavailable: boolean,
  _id: string
}

interface DialogData {
  playlistid: string
}

@Component({
  selector: 'm-dialog-rename-playlist',
  templateUrl: './rename-playlist-dialog.component.html',
  styleUrls: ['./rename-playlist-dialog.component.scss']
})
export class RenamePlaylistDialog {

  CreatePlaylistForm: FormGroup;

  formThingsStyle = {opacity: 1};

  formLoaderStyle = {opacity: 0};

  invalidError = false;

  app$: Observable<{playlists: {name: string, isActive: boolean, id: string, songCount: number, songs: IPlaylstItem[]}[]}>;

  playlists: {name: string, isActive: boolean, id: string, songCount: number, songs: IPlaylstItem[]}[] = [];

  constructor (private http: HttpClient, private dialogRef: MatDialogRef<RenamePlaylistDialog>, private store: Store<{app: {playlists: {name: string, isActive: boolean, id: string, songCount: number, songs: IPlaylstItem[]}[]}}>, private config: ConfigService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.CreatePlaylistForm = new FormGroup({
      'name': new FormControl(null, [Validators.required])
    });

    this.app$ = this.store.select("app");

    this.app$.subscribe({
      next: (state) => {
        this.playlists = state.playlists;
      }
    })
  }

  onSubmit() {

    if (this.CreatePlaylistForm.valid) {

      this.formThingsStyle = {opacity: 0};

      this.formLoaderStyle = {opacity: 1};

      this.invalidError = false;

      this.http.patch(`${this.config.conifgAPIURL}playlists/${this.data.playlistid}/rename`, {
        name: this.CreatePlaylistForm.value.name
      }, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
        }
      }).subscribe({
        next: (data) => {

          setTimeout(() => {

            let temp = cloneDeep(this.playlists);

            const index = temp.findIndex(obj => obj.id === this.data.playlistid);

            temp[index].name = this.CreatePlaylistForm.value.name;

            this.store.dispatch(UpdatePlaylists({playlists: temp}));

            this.dialogRef.close();

          }, 1000);

        },
        error: (error) => {

          setTimeout(() => {

            this.invalidError = true;
  
            this.formLoaderStyle = {opacity: 0};
  
            this.formThingsStyle = {opacity: 1};
  
          }, 1000);

        }
      });

    }

  }

}