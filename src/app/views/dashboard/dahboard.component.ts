import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from 'src/app/components/login-dialog/login-dialog.component';
import {SingupDialogComponent} from 'src/app/components/signup-dialog/signup-dialog.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CreateRoomDialog } from 'src/app/components/create-room-dialog/create-room-dialog.component';
import { ConfigService } from 'src/app/services/config.service';
import { ChangePlaylistPanel, changePlaylistOpenState } from 'src/app/store/app.actions';

interface IRoom {
  name: string,
  id: string,
  slug: string,
  current_dj: {
    user: string,
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
  selector: 'm-app-view-dahboard',
  templateUrl: './dahboard.component.html',
  styleUrls: ['./dahboard.component.scss']
})
export class DahboardComponent implements OnInit {

  app$: Observable<{loggedIn: boolean, nextSongTitle: string, pfp: string, username: string}>

  loggedIn: boolean = false;

  pfp: string | null = null;

  username: string | null = null;

  renderedRoomTitles: IRoom[] = [];

  pageNumber = 1;

  nextSongTitle: string | null = null;
  
  constructor (public dialog: MatDialog, private store: Store<{app: {loggedIn: boolean, nextSongTitle: string, pfp: string, username: string}}>, private auth: AuthService, private http: HttpClient, private config: ConfigService) {

    this.app$ = store.select("app");

    this.app$.subscribe({
      next: (state) => {
        this.loggedIn = state.loggedIn;
        this.pfp = state.pfp;
        this.username = state.username;
        this.nextSongTitle = state.nextSongTitle;
      }
    });

  }

  openLoginDialog () {

    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '420px'
    });

  }

  openSignupDialog () {

    const dialogRef = this.dialog.open(SingupDialogComponent, {
      width: '420px'
    });

  }

  openCreateRoomDialog () {

    const dialogRef = this.dialog.open(CreateRoomDialog, {
      width: '420px'
    });

  }

  openPlaylistPanel () {

    this.store.dispatch(changePlaylistOpenState({open: true}));

    setTimeout(() => {

      this.store.dispatch(ChangePlaylistPanel({style: {bottom: "0", width: "100vw"}}));

    }, 1);
  }

  LogoutClick () {

    this.auth.logout();

  }

  loadNextPage (page: number) {

    this.http.get<{next: number, prev: number, current: number, totalPages: number, data: IRoom[]}>(`${this.config.conifgAPIURL}rooms/${page}`).subscribe({
      next: (data) => {

        let arr = this.renderedRoomTitles;

        for (let i = 0; i < data.data.length; i++) {
          arr.push(data.data[i]);
        }

        this.renderedRoomTitles = arr;
        
      },
      error: (error) => {
        console.log(error);
      }
    })

  }

  ngOnInit(): void {

    document.title = "Musicpad - Dashboard";
    
    this.http.get<{next: number, prev: number, current: number, totalPages: number, items: IRoom[]}>(`${this.config.conifgAPIURL}rooms/1`).subscribe({
      next: (data) => {
        this.renderedRoomTitles = data.items;
      },
      error: (error) => {
        console.log(error);
      }
    })

  }

}
