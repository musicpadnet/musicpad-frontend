import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { Login, SetUserData, changeNextSongTitle } from 'src/app/store/app.actions';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/services/config.service';

interface ILibSong {
  title: string,
  cid: string,
  type: string,
  duration: number,
  thumbnail: string,
  unavailable: boolean,
  _id: string
}

@Component({
  selector: 'm-dialog-login',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {

  loginForm: FormGroup;

  formThingsStyle = {opacity: 1};

  formLoaderStyle = {opacity: 0};

  invalidError = false;

  constructor (private auth: AuthService, private store: Store, private dialogRef: MatDialogRef<LoginDialogComponent>, private http: HttpClient, private config: ConfigService) {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(7), Validators.maxLength(300)])
    })
  }

  onSubmit () {

    if (this.loginForm.valid) {

      this.formThingsStyle = {opacity: 0};

      this.formLoaderStyle = {opacity: 1};

      this.invalidError = false;

      this.auth.login(this.loginForm.value.email, this.loginForm.value.password).then(data => {

        setTimeout(() => {

          this.dialogRef.close();

          window.location.reload();

          this.store.dispatch(Login());

        }, 1000);

      }).catch(err => {

        setTimeout(() => {

          this.invalidError = true;

          this.formLoaderStyle = {opacity: 0};

          this.formThingsStyle = {opacity: 1};

        }, 1000)

      });

    }

  }

}