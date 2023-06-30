import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { LoadingNetworkError, LoadingWebSocketError, SetUserData, appIsReady, changeLoaderStyle, isLoaded } from "../store/app.actions";
import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import { SocketService } from "./socket.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AppService {

  constructor (private router: Router, private http: HttpClient, private store: Store<{app: { isLoaded: boolean, loaderStyle: {opacity: number}}}>, private auth: AuthService, private config: ConfigService, private socket: SocketService) {}

  initiateApplicationCoreBundles () {

    this.http.get<{statusCode: number, message: string}>(this.config.conifgAPIURL).subscribe({
      next: (data) => {

        this.auth.checkLogin().subscribe(({
          next: () => {
            
            this.http.get<{id: string, username: string, profile_image: string}>(`${this.config.conifgAPIURL}accounts/@me`, {
              headers: {
                // @ts-ignore
                Authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
              }
            }).subscribe({
              next: (data) => {
    
                if (data.profile_image === null) {
                  this.store.dispatch(SetUserData({pfp: "/assets/default.png", username: data.username, id: data.id}));
                } else {
                  this.store.dispatch(SetUserData({pfp: data.profile_image, username: data.username, id: data.id}));
                }
    
              },
              error: (error) => {
                console.log(error);
              }
            });
    
            this.socket.connectToWebscoket().subscribe({
              next: () => {
    
                this.store.dispatch(appIsReady());
    
                setTimeout(() => {
    
                  this.store.dispatch(changeLoaderStyle({style: {opacity: 0}}));
          
                  setTimeout(() => {
                    this.store.dispatch(isLoaded());
                  }, 500);
          
                }, 1000);
    
              },
              error: (error) => {
    
                console.log(error);
    
                this.store.dispatch(LoadingWebSocketError());
    
              }
            });

          },
          error: (error) => {
            console.log(error);
          }
        }));

      }, 
      error: (err) => {

        this.store.dispatch(LoadingNetworkError());

      }
      
    });

  }

}