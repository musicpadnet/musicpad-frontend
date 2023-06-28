import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { ConfigService } from "src/app/services/config.service";

@Component({
  selector: 'm-dialog-create-playlist',
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.scss']
})
export class CreateRoomDialog {

  CreateRoomForm: FormGroup;

  formThingsStyle = {opacity: 1};

  formLoaderStyle = {opacity: 0};

  invalidError = false;

  app$: Observable<{playlists: {name: string, isActive: boolean, id: string, songCount: number}[]}>;

  playlists: {name: string, isActive: boolean, id: string, songCount: number}[] = [];

  constructor (private http: HttpClient, private dialogRef: MatDialogRef<CreateRoomDialog>, private store: Store<{app: {playlists: {name: string, isActive: boolean, id: string, songCount: number}[]}}>, private router: Router, private config: ConfigService) {
    this.CreateRoomForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'slug': new FormControl(null, [Validators.required, Validators.pattern("^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._ ]+(?<![_.])$"), Validators.minLength(3), Validators.maxLength(35)])
    });

    this.app$ = this.store.select("app");

    this.app$.subscribe({
      next: (state) => {
        this.playlists = state.playlists;
      }
    })
  }

  onSubmit() {

    if (this.CreateRoomForm.valid) {

      this.formThingsStyle = {opacity: 0};

      this.formLoaderStyle = {opacity: 1};

      this.invalidError = false;

      this.http.post<{slug: string}>(`${this.config.conifgAPIURL}rooms/create`, {
        name: this.CreateRoomForm.value.name,
        slug: this.CreateRoomForm.value.slug
      },
      {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
        }
      }).subscribe({
        next: (data) => {
          
          setTimeout(() => {

            window.location.replace(`/${data.slug}`);

            this.dialogRef.close();        

          }, 5000);

        },
        error: (err) => {
          
          console.log(err);

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