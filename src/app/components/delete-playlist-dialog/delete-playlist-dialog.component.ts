import { HttpClient } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { ConfigService } from "src/app/services/config.service";
import { UpdatePlaylists } from "src/app/store/app.actions";

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
  selector: 'm-dialog-delete-playlist',
  templateUrl: './delete-playlist-dialog.component.html',
  styleUrls: ['./delete-playlist-dialog.component.scss']
})
export class DeletePlaylistDialog {

  CreatePlaylistForm: FormGroup;

  formThingsStyle = {opacity: 1};

  formLoaderStyle = {opacity: 0};

  invalidError = false;

  app$: Observable<{playlists: {name: string, isActive: boolean, id: string, songCount: number}[]}>;

  playlists: {name: string, isActive: boolean, id: string, songCount: number}[] = [];

  constructor (private http: HttpClient, private dialogRef: MatDialogRef<DeletePlaylistDialog>, private store: Store<{app: {playlists: {name: string, isActive: boolean, id: string, songCount: number}[]}}>, private config: ConfigService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.CreatePlaylistForm = new FormGroup({
      'password': new FormControl(null, [Validators.required])
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

      this.http.delete(`${this.config.conifgAPIURL}playlists/${this.data.playlistid}`, {
        body: {
          password: this.CreatePlaylistForm.value.password
        },
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
        }
      }).subscribe({
        next: (data) => {

          setTimeout(() => {

            this.http.get<{playlists: {name: string, isActive: boolean, id: string, songCount: number, songs: IPlaylstItem[]}[]}>(`${this.config.conifgAPIURL}playlists`, {
              headers: {
              Authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
              }
            }).subscribe({
              next: (data) => {
                this.store.dispatch(UpdatePlaylists({playlists: data.playlists}));
              },
              error: (err) => {
                console.log(err);
              }
            });

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