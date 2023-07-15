import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { RoomService } from 'src/app/services/room.service';

interface IRoom {
  name: string,
  id: string,
  slug: string,
  owner: {
    id: string,
    username: string,
    pfp: string
  },
  current_dj: {
    user: {
      username: string,
      id: string,
      pfp: string
    },
    song: {
      title: string,
      duration: number,
      time: number,
      upvotes: number,
      downvotes: number,
      thumbnail: string,
      grabs: number
    }
  },
  users: string []
}

@Component({
  selector: 'm-app-room-menu',
  templateUrl: './room-menu.component.html',
  styleUrls: ['./room-menu.component.scss']
})
export class RoomMenuComponent implements OnInit {

  @Input("tab") tab!: string;

  rooms: IRoom[] = [];

  roomInfoPanel = false;

  roomHistoryPanel = false;

  roomRoomsPanel = false;

  roomInfoBStyle: any = {background: "transparent", borderLeft: "transparent"};

  roomHistoryBStyle: any = {background: "transparent", borderLeft: "transparent"};

  roomRoomsBStyle: any = {background: "transparent", borderLeft: "transparent"};

  roomDescription: string | null | undefined = "none";

  roomMessage: string | null | undefined = "none";

  roomLock: boolean | null | undefined = false;

  roomCycle: boolean | null | undefined = false;

  roomOwnerId: string | null | undefined = null;

  disableBtns = true;

  userid: string | null | undefined = null;

  app$: Observable<{id: string}>;

  constructor (private config: ConfigService, private http: HttpClient, private room: RoomService, private store: Store<{app: {id: string}}>) {
    this.app$ = this.store.select("app");

    this.app$.subscribe({
      next: (state) => {

        this.userid = state.id;

      }
    })

  }

  ngOnInit(): void {

    this.room.fetchRoom(window.location.pathname.slice(1, window.location.pathname.length)).then(data => {

      this.roomDescription = data.description;

      this.roomMessage = data.welcome_message;

      this.roomCycle = data.queue_cycle;

      this.roomLock = data.queue_locked;

      this.roomOwnerId = data.owner.id;

      if (this.roomOwnerId === this.userid) {

        this.disableBtns = false;

      }

    }).catch(err => {

      console.log(err);

    });

    this.http.get<{next: number, prev: number, current: number, totalPages: number, items: IRoom[]}>(`${this.config.conifgAPIURL}rooms/1`).subscribe({
      next: (data) => {
        this.rooms = data.items;
      },
      error: (error) => {
        console.log(error);
      }
    });

    if (this.tab === "room") {

      this.roomInfoPanel = true;

      this.roomInfoBStyle = {background: "rgba(0, 117, 213 ,0.2)", borderLeft: "4px solid rgb(0, 117, 213)", width: "48px"};

    } else if (this.tab === "history") {

      this.roomHistoryPanel = true;

      this.roomHistoryBStyle = {background: "rgba(0, 117, 213 ,0.2)", borderLeft: "4px solid rgb(0, 117, 213)", width: "48px"};

    } else if (this.tab = "rooms") {

      this.roomRoomsPanel = true;

      this.roomRoomsBStyle = {background: "rgba(0, 117, 213 ,0.2)", borderLeft: "4px solid rgb(0, 117, 213)", width: "48px"};

    }

  }

  onClickRooms () {

    this.removeTabs();

    this.roomRoomsPanel = true;

    this.roomRoomsBStyle = {background: "rgba(0, 117, 213 ,0.2)", borderLeft: "4px solid rgb(0, 117, 213)", width: "48px"};

  }

  onClickHistory () {

    this.removeTabs();

    this.roomHistoryPanel = true;

    this.roomHistoryBStyle = {background: "rgba(0, 117, 213 ,0.2)", borderLeft: "4px solid rgb(0, 117, 213)", width: "48px"};

  }

  onClickInfo () {

    this.removeTabs();

    this.roomInfoPanel = true;

    this.roomInfoBStyle = {background: "rgba(0, 117, 213 ,0.2)", borderLeft: "4px solid rgb(0, 117, 213)", width: "48px"};

  }

  removeTabs () {

    this.roomInfoPanel = false;

    this.roomHistoryPanel = false;

    this.roomRoomsPanel = false;

    this.roomInfoBStyle = {background: "transparent", borderLeft: "transparent"};

    this.roomHistoryBStyle = {background: "transparent", borderLeft: "transparent"};

    this.roomRoomsBStyle = {background: "transparent", borderLeft: "transparent"};

  }

}
