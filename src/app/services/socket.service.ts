import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { LoadingWebSocketError, appIsNotReady, appIsReady, changeLoaderStyle, isLoaded, isNotLoaded, webScoketDisconnectError } from "../store/app.actions";

import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: "root"
})
export class SocketService {

  socket: Socket | null = null;

  constructor (private store: Store) {}

  connectToWebscoket (): Observable<string> {

    return new Observable((observer) => {

      this.socket = io("http://localhost:4000", { transports : ['websocket'], reconnection: true});

      this.socket.on("connect", () => {

        observer.next("Connected to sockie");

        this.listenForDisconnect();

        this.authenticate();

      });

      this.socket.io.on("reconnect", () => {

        window.location.reload();

      });

      this.socket.on("connect_error", () => {

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

  getRoomTime () {

    this.socket?.emit("message", {type: "method", method: "getcurrenttime"});

  }

  upvote () {

    this.socket?.emit("message", {type: "method", method: "upvote"});

  }

  downvote () {

    this.socket?.emit("message", {type: "method", method: "downvote"});

  }

  selfSkip () {

    this.socket?.emit("message", {type: "method", method: "selfskip"});

  }

  listenForDisconnect () {

    this.socket?.on("disconnect", (event) => {

      this.store.dispatch(isNotLoaded());

      setTimeout(() => {

        this.store.dispatch(appIsNotReady());

        this.store.dispatch(changeLoaderStyle({style: {opacity: 1}}));

        this.store.dispatch(LoadingWebSocketError());

      }, 500);

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