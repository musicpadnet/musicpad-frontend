import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser"
import { ConfigService } from "src/app/services/config.service";
import { SetUserData } from "src/app/store/app.actions";

@Component({
  selector: 'm-dialog-change-avatar',
  templateUrl: './change-avatar-dialog.component.html',
  styleUrls: ['./change-avatar-dialog.component.scss']
})
export class ChangeAvatarDialog {

  ChangeAvatarForm: FormGroup;

  formThingsStyle = {opacity: 1};

  avatarUrl: any = "null";

  avatar: string = "null";

  formLoaderStyle = {display: "none"};

  invalidError = false;

  @ViewChild("uploadInput") uploadInput!: ElementRef;

  app$: Observable<{pfp: string, playlists: {name: string, isActive: boolean, id: string, songCount: number}[]}>;

  constructor (private http: HttpClient, private dialogRef: MatDialogRef<ChangeAvatarDialog>, private store: Store<{app: {pfp: string, playlists: {name: string, isActive: boolean, id: string, songCount: number}[]}}>, private config: ConfigService, private sanitization: DomSanitizer) {
    this.ChangeAvatarForm = new FormGroup({
      'avatar': new FormControl(null, [Validators.required])
    });

    this.app$ = this.store.select("app");

    this.app$.subscribe({
      next: (state) => {
        if (!state.pfp) {
          this.avatarUrl = "/assets/default.png";
        } else {
          this.avatarUrl = state.pfp;
        }
      }
    })
  }

  onUploadClick () {
    
    document.getElementById("avatar-input")?.click();

  }

  onSubmit () {

    if (this.ChangeAvatarForm.valid) {

      this.formThingsStyle = {opacity: 0};

      this.formLoaderStyle = {display: "block"};

      let body = new FormData();

      // @ts-ignore
      const [file] = document.getElementById("avatar-input")?.files;

      body.append("avatar", file);

      this.http.post(`${this.config.conifgAPIURL}accounts/pfp`, body, {
        headers: {
          "Authorization": `Bearer ${window.localStorage.getItem("accesstoken")}`,
        }
      }).subscribe({
        next: (data) => {

          setTimeout(() => {

            this.http.get<{id: string, username: string, profile_image: string}>(`${this.config.conifgAPIURL}accounts/@me`, {
              headers: {
                // @ts-ignore
                Authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
              }
            }).subscribe({
              next: (data) => {
                if (!data.profile_image) {
                  this.store.dispatch(SetUserData({pfp: "/assets/default.png", username: data.username, id: data.id}));
                } else {
                  this.store.dispatch(SetUserData({pfp: data.profile_image, username: data.username, id: data.id}));
                }
    
                this.dialogRef.close();

              },
              error: (error) => {
                console.log(error);
              }
            });

          }, 2000);
        },
        error: (err) => {
          console.log(err);
        }
      });

    }

  }

  onChange (e: any) {

    // @ts-ignore
    const [file] = document.getElementById("avatar-input")?.files;

    this.avatarUrl = this.sanitization.bypassSecurityTrustUrl(URL.createObjectURL(file));

  }

}