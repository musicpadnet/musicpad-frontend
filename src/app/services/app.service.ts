import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { LoadingNetworkError, LoadingWebSocketError, SetUserData, changeLoaderStyle, isLoaded } from "../store/app.actions";
import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import { SocketService } from "./socket.service";

@Injectable({
  providedIn: "root"
})
export class AppService {

  constructor (private http: HttpClient, private store: Store<{app: { isLoaded: boolean, loaderStyle: {opacity: number}}}>, private auth: AuthService, private config: ConfigService, private socket: SocketService) {}

  async initiateApplicationCoreBundles () {

    this.http.get<{statusCode: number, message: string}>(this.config.conifgAPIURL).subscribe({
      next: async (data) => {

        this.auth.checkLogin();

        this.http.get<{id: string, username: string, profile_image: string}>(`${this.config.conifgAPIURL}accounts/@me`, {
          headers: {
            // @ts-ignore
            Authorization: `Bearer ${window.localStorage.getItem("accesstoken")}`
          }
        }).subscribe({
          next: (data) => {

            if (data.profile_image === null) {
              this.store.dispatch(SetUserData({pfp: "/assets/default.jpg", username: data.username}));
            } else {
              this.store.dispatch(SetUserData({pfp: data.profile_image, username: data.username}));
            }

          },
          error: (error) => {
            console.log(error);
          }
        });

        this.socket.connectToWebscoket().subscribe({
          next: () => {

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

            let interval = setInterval(() => {
            
              this.socket.connectToWebscoket().subscribe({
                next: () => {
                  
                  clearInterval(interval);
      
                  setTimeout(() => {
  
                    this.store.dispatch(changeLoaderStyle({style: {opacity: 0}}));
  
                    setTimeout(() => {
                      this.store.dispatch(isLoaded());
                    }, 500);
  
                  }, 1000);

                },
                error: () => {
                  console.log("still unable to connect to musicpad's realtime websocket!!!!!! :((((((");
                }
              });

            }, 30000);

          }
        });

      }, 
      error: (err) => {
        
        this.store.dispatch(LoadingNetworkError());

        let interval = setInterval(() => {

          this.http.get<{statusCode: number, message: string}>(this.config.conifgAPIURL).subscribe({
            next: (data) => {

              clearInterval(interval);

              this.auth.checkLogin();
      
              setTimeout(() => {
  
                this.store.dispatch(changeLoaderStyle({style: {opacity: 0}}));
  
                setTimeout(() => {
                  this.store.dispatch(isLoaded());
                }, 500);
  
              }, 1000);

            },
            error: (err) => {
              console.log(err);
            }
          });
  
        }, 30000);

      }
    });

  }

}