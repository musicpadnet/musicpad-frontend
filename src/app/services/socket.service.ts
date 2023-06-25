import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { LoadingWebSocketError, appIsNotReady, appIsReady, changeLoaderStyle, isLoaded, isNotLoaded, removeErrors, webScoketDisconnectError } from "../store/app.actions";

import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: "root"
})
export class SocketService {

  socket: Socket | null = null;

  constructor (private store: Store) {}

  connectToWebscoket (): Observable<string> {

    return new Observable((observer) => {

      this.socket = io("http://localhost:4000", { transports : ['websocket']});

      this.socket.on("connect", () => {

        observer.next("Connected to sockie");

        this.listenForDisconnect();

        this.authenticate();

      });

      this.socket.on("error", () => {

        observer.error("Unable to connect to musicpad's realtime websocket reeeeeerooooo!!! :(((((");

      });

    });

  }

  listenForMessages (): Observable<any> {

    return new Observable ((observer) => {

      this.socket?.on("message", (data) => {

        console.log()

        observer.next(data);

      });

    });

  }

  joinRoom (room: string) {

    this.socket?.emit("message", {type: "method", method: "joinroom", room: room});

  }

  listenForDisconnect () {

    this.socket?.on("disconnect", (event) => {

      this.store.dispatch(isNotLoaded());

      setTimeout(() => {

        this.store.dispatch(appIsNotReady());

        this.store.dispatch(changeLoaderStyle({style: {opacity: 1}}));

        this.store.dispatch(LoadingWebSocketError());

      }, 500);

      let interval = setInterval(() => {

        this.connectToWebscoket().subscribe({
          next: () => {

            this.store.dispatch(removeErrors());

            clearInterval(interval);

            this.store.dispatch(appIsReady());
      
            setTimeout(() => {
  
              this.store.dispatch(changeLoaderStyle({style: {opacity: 0}}));
  
              setTimeout(() => {
                this.store.dispatch(isLoaded());
              }, 500);
  
            }, 1000);

          },
          error: () => {
            console.log("Still trying to reconnect!!!")
          }
        })

      }, 30000);

    });

  }

  authenticate () {

    if (window.localStorage.getItem("refreshtoken")) {

      this.socket?.emit("message", {type: "method", method:"auth", token: window.localStorage.getItem("accesstoken")});

    }

  }

  joinQueue () {

    this.socket?.emit("message", {type: "method", method: "joinqueue"});

  }

  leaveQueue () {

    this.socket?.emit("message", {type: "method", method: "leavequeue"});

  }

  sendMessage (message: string) {

    this.socket?.emit("message", {type: "method", "method": "chatmessage", message: message});

  }

}