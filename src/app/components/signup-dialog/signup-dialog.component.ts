import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { Login } from 'src/app/store/app.actions';

@Component({
  selector: 'm-dialog-signup',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SingupDialogComponent {

  signupForm: FormGroup

  formThingsStyle = {opacity: 1};

  formLoaderStyle = {opacity: 0};

  usernameAlreadyUsedError = false;

  emailAlreadyUsed = false;

  passwordError = false;

  passwordMatchError = false;

  constructor (private auth: AuthService, private dialogRef: MatDialogRef<SingupDialogComponent>, private store: Store) {
    this.signupForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'username': new FormControl(null, [Validators.required, Validators.pattern(new RegExp("^(?![_.])(?!.*[_. ]{2})[a-zA-Z0-9._ ]+(?<![_.])$"))]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(7), Validators.maxLength(300)]),
      'verifypassword': new FormControl(null, Validators.required),
      'terms': new FormControl(false)
    })
  }

  async onSubmit () {
    
    if (this.signupForm.touched && this.signupForm.valid && this.signupForm.value.terms === true) {

      if (this.signupForm.value.password !== this.signupForm.value.verifypassword) {

        this.passwordMatchError = true;

      } else {

        this.formThingsStyle = {opacity: 0};

        this.formLoaderStyle = {opacity: 1};

        this.usernameAlreadyUsedError = false;

        this.emailAlreadyUsed = false;

        this.passwordError = false;

        this.passwordMatchError = false;

        this.auth.signupRequest(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.username).then(data => {

          setTimeout(() => {

            this.formLoaderStyle = {opacity: 0};

            this.formThingsStyle = {opacity: 1};

            this.store.dispatch(Login());

            this.dialogRef.close();

          }, 1000);

        }).catch(err => {

          setTimeout(() => {

            this.formLoaderStyle = {opacity: 0};

            this.formThingsStyle = {opacity: 1};

            switch (err.error.message) {
              case "Username already taken":
                this.usernameAlreadyUsedError = true;
              break;
              case "Email already registered":
                this.emailAlreadyUsed = true;
              break;
              case `"password" length must be at least 7 characters long`:
                this.passwordError = true;
              break;
            }

          }, 1000);

        });

      }

    } else {

      console.log("invalid form");

    }

    console.log(this.signupForm);

  }

}