import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { LoadingWebSocketError, appIsNotReady, appIsReady, changeLoaderStyle, isLoaded, isNotLoaded, removeErrors, webScoketDisconnectError } from "../store/app.actions";

@Injectable({
  providedIn: "root"
})
export class SocketService {

  socket: WebSocket | null = null;

  constructor (private store: Store) {}

  connectToWebscoket (): Observable<string> {

    return new Observable((observer) => {

      this.socket = new WebSocket("ws://localhost:4000");

      this.socket.addEventListener("error", (event) => {

        observer.error("Unable to connect to musicpad's realtime websocket reeeeeerooooo!!! :(((((");

      });

      this.socket.addEventListener("open", (event) => {
      
        observer.next("Connected to sockie");

        this.listenForHeartbeats();

        this.authenticate();

      });

    });

  }

  listenForHeartbeats () {

    console.log("now listneing for and returning heartbeats")

    this.socket?.addEventListener("message", (event) => {
      
      try {

        const parsedMessage = JSON.parse(event.data);

        if (parsedMessage.type === "heartbeat") {
          this.socket?.send(JSON.stringify({"type": "heartbeat"}));
        }

      } catch (err) {

        console.log(err);

      }

    });

    this.socket?.addEventListener("close", (event) => {

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

      this.socket?.send(JSON.stringify({"type":"auth","token":window.localStorage.getItem("accesstoken")}));

    }

  }

}