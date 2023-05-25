import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Login, Logout } from '../store/app.actions';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private store: Store, private config: ConfigService) { }

  timeout: ReturnType<typeof setInterval> | undefined = undefined;

  // signup request method
  signupRequest (email: string, password: string, username: string) {

      const promise = new Promise ((resolve, reject) => {

        this.http.post<{access_token: string, refresh_token: string, expires: number}>(`${this.config.conifgAPIURL}auth/register`, {
          email,
          password,
          username
        }).subscribe({
          next: (data) => {
            window.localStorage.setItem("accesstoken", data.access_token);
            window.localStorage.setItem("refreshtoken", data.refresh_token);
            window.localStorage.setItem("expires", data.expires.toString());

            const adjustTime = Math.abs(((Date.now() - data.expires) / 1000)) * 1000;

            this.timeout = setInterval(() => {
              this.refreshTokens();
            }, adjustTime);
            resolve(data);
          },
          error: (error) => {
            console.log(error);
            reject(error);
          }
        });

      });

      return promise;

  }

  // check login method
  checkLogin () {

    const refreshtoken = window.localStorage.getItem("refreshtoken");

    const expires = window.localStorage.getItem("expires");

    if (refreshtoken) {

      this.store.dispatch(Login());

      // @ts-ignore
      const adjustTime = Math.abs(((Date.now() - parseInt(expires)) / 1000)) * 1000;

      // @ts-ignore
      const adjustAcctime = ((Date.now() - parseInt(expires)) / 1000);

      console.log(adjustTime);

      if (adjustAcctime >= 0) {

        this.refreshTokens().then(() => {

          // @ts-ignore
          const expires2 = parseInt(window.localStorage.getItem("expires"));

          // @ts-ignore
          const adjustTime2 = Math.abs(((Date.now() - parseInt(expires2)) / 1000)) * 1000;

          this.timeout = setInterval(() => {

            this.refreshTokens().then().catch();

          }, adjustTime2);

        }).catch();

      } else {

        // @ts-ignore
        const expires2 = parseInt(window.localStorage.getItem("expires"));

        // @ts-ignore
        const adjustTime2 = Math.abs(((Date.now() - parseInt(expires2)) / 1000)) * 1000;

        this.timeout = setInterval(() => {

          this.refreshTokens().then().catch();

        }, adjustTime2);

      }

    }

  }

  // login method
  login (email: string, password: string) {

    const promise = new Promise((resolve, reject) => {

      this.http.post<{access_token: string, refresh_token: string, expires: number}>(`${this.config.conifgAPIURL}auth/login`, {
        email,
        password
      }).subscribe({
        next: (data) => {
          window.localStorage.setItem("accesstoken", data.access_token);
          window.localStorage.setItem("refreshtoken", data.refresh_token);
          window.localStorage.setItem("expires", data.expires.toString());

          const adjustTime = Math.abs(((Date.now() - data.expires) / 1000)) * 1000;

          this.timeout = setInterval(() => {
            this.refreshTokens();
          }, adjustTime);
          
          resolve(data);
        },
        error: (error) => {
          reject(error);
        }
      })

    });

    return promise;

  }

  // logout method
  logout () {

    clearInterval(this.timeout);

    window.localStorage.removeItem("refreshtoken");
    window.localStorage.removeItem("accesstoken");
    window.localStorage.removeItem("expires");

    this.store.dispatch(Logout());

  }

  // refresh tokens method
  refreshTokens () {

    const promise = new Promise((resolve, reject) => {

      if (!window.localStorage.getItem("refreshtoken")) return console.log("unable to access refresh token");

      this.http.post<{access_token: string, refresh_token: string, expires: number}>(`${this.config.conifgAPIURL}auth/refresh`, {
        refresh_token: window.localStorage.getItem("refreshtoken")
      }).subscribe({
        next: (data) => {
        
          window.localStorage.setItem("accesstoken", data.access_token);
          window.localStorage.setItem("refreshtoken", data.refresh_token);
          window.localStorage.setItem("expires", data.expires.toString());

          resolve(data);

        },
        error: (err) => {
          clearTimeout(this.timeout);
          window.localStorage.removeItem("accesstoken");
          window.localStorage.removeItem("refreshtoken");
          window.localStorage.removeItem("expires");
          reject(err);
        }
      })

    });

    return promise;

  }
}
