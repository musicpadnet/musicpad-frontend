import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, Input } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';

interface IRoom {
  name: string,
  id: string,
  slug: string,
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

  constructor (private config: ConfigService, private http: HttpClient) {}

  ngOnInit(): void {

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

      this.roomInfoBStyle = {background: "rgba(0, 117, 213 ,0.2)", borderLeft: "4px solid rgb(0, 117, 213)", width: "46px"};

    } else if (this.tab === "history") {

      this.roomHistoryPanel = true;

      this.roomHistoryBStyle = {background: "rgba(0, 117, 213 ,0.2)", borderLeft: "4px solid rgb(0, 117, 213)", width: "46px"};

    } else if (this.tab = "rooms") {

      this.roomRoomsPanel = true;

      this.roomRoomsBStyle = {background: "rgba(0, 117, 213 ,0.2)", borderLeft: "4px solid rgb(0, 117, 213)", width: "46px"};

    }

  }

  onClickRooms () {

    this.removeTabs();

    this.roomRoomsPanel = true;

    this.roomRoomsBStyle = {background: "rgba(0, 117, 213 ,0.2)", borderLeft: "4px solid rgb(0, 117, 213)", width: "46px"};

  }

  onClickHistory () {

    this.removeTabs();

    this.roomHistoryPanel = true;

    this.roomHistoryBStyle = {background: "rgba(0, 117, 213 ,0.2)", borderLeft: "4px solid rgb(0, 117, 213)", width: "46px"};

  }

  onClickInfo () {

    this.removeTabs();

    this.roomInfoPanel = true;

    this.roomInfoBStyle = {background: "rgba(0, 117, 213 ,0.2)", borderLeft: "4px solid rgb(0, 117, 213)", width: "46px"};

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
