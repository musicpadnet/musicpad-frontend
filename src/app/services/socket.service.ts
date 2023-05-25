import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SocketService {

  socket: WebSocket | null = null;

  constructor () {}

  connectToWebscoket (): Observable<string> {

    return new Observable((observer) => {

      this.socket = new WebSocket("ws://localhost:4000");

      this.socket.addEventListener("error", (event) => {

        observer.error("Unable to connect to websocket server reeeeeerooooo!!! :(((((");

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

  }

  authenticate () {

    if (window.localStorage.getItem("refreshtoken")) {

      this.socket?.send(JSON.stringify({"type":"auth","token":window.localStorage.getItem("accesstoken")}));

    }

  }

}