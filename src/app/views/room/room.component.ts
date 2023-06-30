import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash-es';
import { Observable } from 'rxjs';
import { LoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';
import { SingupDialogComponent } from 'src/app/components/signup-dialog/signup-dialog.component';
import { IRoomData, RoomService } from 'src/app/services/room.service';
import { SocketService } from 'src/app/services/socket.service';
import { ChangePlaylistPanel, UpdatePlaylists, changeNextSongTitle, changePlaylistOpenState, changeUserMenuOpen, changeUserMenuStyle } from 'src/app/store/app.actions';
import { changeRoomIsOpen, changeRoomMenuStyle } from 'src/app/store/room.actions';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'm-app-view-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy, AfterViewInit {

  tabToOpen: string = "room";
  
  roomName: string | null = null;

  roomDJ: string | null = null;

  nextSongtitle: string | null = null;

  currentDJId: string | null = null;

  roomUsers:number = 0;

  waitlist: any[] = [];

  pfp: string = "null";

  roomIsLoaded = false;

  roomLoaderStyle = {height: "100%"};

  loaderStyle = {opacity: 1};

  username: string = "null";

  userMenuIsOpen = false;

  time = 0;

  loggedIn = false;

  roomMenuStyle = {top: "-100vh"};

  users: any[] = []; 

  roomMenuIsOpen = false;

  chatMessages: {message: string, pfp: string, username: string}[] = [];

  chatForm: FormGroup;

  upvotes: any[] = [];

  downvotes: any[] = [];

  volStyle = {"display": "none"};

  cidToPlay: string = "null";

  durationTOStart: number = 0;

  title = "null";

  id!: string | null;

  inQueue: boolean = false;

  timer!: ReturnType<typeof setInterval>;

  @ViewChild("volume") volume!: ElementRef;

  @ViewChild("chatScroll") chatScroll!: ElementRef;

  app$: Observable<{id: string | null, loggedIn: boolean, nextSongTitle: string, userMenuIsOpen: boolean, username: string, pfp: string, playlistStyle: {bottom: string}, playlistOpenState: boolean}>;

  room$: Observable<{roomMenuStyle: {top: string}, roomMenuIsOpen: boolean}>;

  constructor (public dialog: MatDialog, private room: RoomService, private store: Store<{app: {id: string | null, username: string, userMenuIsOpen: boolean, pfp: string, nextSongTitle: string, playlistStyle: {bottom: string}, playlistOpenState: boolean, loggedIn: boolean}, room: {roomMenuStyle: {top: string}, roomMenuIsOpen: boolean}}>, private socket: SocketService) {

    this.app$ = store.select("app");

    this.room$ = store.select("room");

    this.chatForm = new FormGroup({
      "chat": new FormControl(null, [Validators.required, Validators.maxLength(300)])
    });

    this.app$.subscribe({
      next: (state) => {
        this.nextSongtitle = state.nextSongTitle;
        this.username = state.username;
        this.pfp = state.pfp;
        this.userMenuIsOpen = state.userMenuIsOpen;
        this.loggedIn = state.loggedIn;
        this.id = state.id;
      }
    });

    this.room$.subscribe({
      next: (state) => {
        this.roomMenuStyle = state.roomMenuStyle;
        this.roomMenuIsOpen = state.roomMenuIsOpen;
      }
    });

  }

  changeVolume (value: string) {

    window.localStorage.setItem("volume", value);

    this.room.setVol(parseInt(value));

  }

  openPlaylistPanel () {

    if (this.loggedIn === true) {

      this.store.dispatch(changePlaylistOpenState({open: true}));

      setTimeout(() => {

        this.store.dispatch(ChangePlaylistPanel({style: {bottom: "0"}}));

      }, 1);

    } else {

      this.openSignupDialog();

    }

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

  ngOnInit() {

    document.title = "Connecting...";

    let volval = window.localStorage.getItem("volume");
    
    if (volval) {
      console.log(this.volume);
    }
    
    this.room.fetchRoom(window.location.pathname.slice(1, window.location.pathname.length)).then((data: IRoomData) => {

      this.roomName = data.name;

      this.waitlist = data.waitlist;

      this.users = data.users;

      if (!data.current_dj.song.title) {
        this.title = "Nobody is playing";
        this.durationTOStart = 0;
        this.currentDJId = null;
      } else {
        this.title = data.current_dj.song.title;
        this.durationTOStart = data.current_dj.song.duration;
        this.currentDJId = data.current_dj.user.id;
      }
      
      this.socket.joinRoom(data.slug);

      this.socket.listenForMessages().subscribe({
        next: (data) => {

          switch (data.event) {

            case "userJoined":

              this.users = data.users;

            break;

            case "chatmessage":

              let message = {
                username: data.username,
                pfp: data.pfp || "/assets/default.png",
                message: data.message
              }
              
              let dep = cloneDeep(this.chatMessages);

              dep.push(message);

              this.chatMessages = dep;

              setTimeout(() => {

                try {

                  this.chatScroll.nativeElement.scrollTop = this.chatScroll.nativeElement.scrollHeight;

                } catch (err) {
                  console.log(err);
                }

              }, 1.5);

            break;

            case "userLeft":

              this.users = data.users;

            break;

            case "joinedqueue":

              this.inQueue = true;

            break;

            case "leftqueue":

              this.inQueue = false;

            break;

            case "currenttime":

              console.log(data.time);

              if (data.time !== null) {

                this.room.startPlayer(this.cidToPlay, data.time);

                let time = this.durationTOStart - data.time;

                this.stopTimer();

                this.startTimer(Math.trunc(time));

              }

            break;

            case "userjoinqueue":

              this.waitlist = data.waitlist;

            break;

            case "userleavewaitlist":

              this.waitlist = data.waitlist;

            break;

            case "advance":

              this.waitlist = data.waitlist;

              this.upvotes = [];

              this.downvotes = [];

              if (data.current_dj.song.cid !== null) {

                if (this.room.getYTPlayerExists() === true) {

                  this.room.destoryPlayer();

                }

                this.currentDJId = data.current_dj.user.id;

                this.room.startPlayer(data.current_dj.song.cid, null);

                this.stopTimer();

                this.startTimer(data.current_dj.song.duration);

                this.title = data.current_dj.song.title;

                this.roomDJ = `current dj: ${data.current_dj.user.username}`;

              } else {

                this.room.destoryPlayer();

                this.stopTimer();

                this.currentDJId = null;

                this.title = "Nobody is playing";

                this.roomDJ = "current dj: Nobody";

              }

            break;

            case "updateuserpl":

              this.store.dispatch(UpdatePlaylists({playlists: data.playlists}));

              const plIndex = data.playlists.findIndex((obj: any) => obj.isActive === true);

              this.store.dispatch(changeNextSongTitle({title: data.playlists[plIndex].songs[0].title}));

            break;

            case "upvotesupdate":

              this.upvotes = data.upvotes;

            break;

            case "downvotesupdate":

              this.downvotes = data.downvotes;

            break;

          }

        }
      });

      if (data.current_dj.user === null) {

        this.roomDJ = "current dj: Nobody";

      } else {

        this.roomDJ = `current dj: ${data.current_dj.user.username}`;

        this.cidToPlay = data.current_dj.song.cid;

        setTimeout(() => {

          this.socket.getRoomTime();

        }, 3000);

      }

      setTimeout(() => {

        document.title = `Mixzy - ${data.name}`;

        this.roomLoaderStyle = {height: "0%"};

        this.loaderStyle = {opacity: 0};

          setTimeout(() => {

            this.roomIsLoaded = true;
  
          }, 2000);

      }, 3000);

    }).catch(err => {
      console.log(err);
    });

  }

  clickUpvote () {

    this.socket.upvote();

  }

  clickDownvote () {

    this.socket.downvote();

  }

  showVolSlider () {
    this.volStyle = {"display": "block"};
  }

  removeVolSlider() {
    this.volStyle = {"display": "none"};
  }

  onTabChanged ($event: any) {

    try {

      this.chatScroll.nativeElement.scrollTop = this.chatScroll.nativeElement.scrollHeight;

    } catch (err) {
      console.log(err);
    }

  }

  startTimer (seconds: number) {
   
    this.time = seconds;

    this.timer = setInterval(() => {
      
      this.time = this.time - 1;

      if (this.time <= 0) {

        this.time = 0;

        clearInterval(this.timer);

      }

    }, 1000);
    
  }

  stopTimer () {

    this.time = 0;

    clearInterval(this.timer);

  }

  makeTime (seconds: number): string {
      
    const hours   = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60) % 60;
    const secs = seconds % 60;
  
    return [hours,minutes,secs]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")

  }

  async onClickJoinQueue () {

    this.socket.joinQueue();

  }

  async onClickLeaveQueue () {

    this.socket.leaveQueue();

  }

  onClickUserMenu () {

    if (this.userMenuIsOpen === true) {

      this.store.dispatch(changeUserMenuStyle({style: {right: "-300px"}}));

      this.store.dispatch(changeUserMenuOpen({isOpen: false}));

    } else {

      this.store.dispatch(changeUserMenuOpen({isOpen: true}));

      this.store.dispatch(changeUserMenuStyle({style: {right: "0"}}))

    }

  }

  toggleRoomMenu () {

    if (this.roomMenuIsOpen === true) {

      this.store.dispatch(changeRoomMenuStyle({style: {top: "-100vh"}}));

      setTimeout(() => {

        this.store.dispatch(changeRoomIsOpen({isOpen: false}));

      }, 400);

    } else {

      this.tabToOpen = "room";

      this.store.dispatch(changeRoomIsOpen({isOpen: true}));

      setTimeout(() => {
        
        this.store.dispatch(changeRoomMenuStyle({style: {top: "50px"}}))

      }, 1);

    }

  }

  toggleRoomMenuHistory () {

    if (this.roomMenuIsOpen === true) {

      this.store.dispatch(changeRoomMenuStyle({style: {top: "-100vh"}}));

      setTimeout(() => {

        this.store.dispatch(changeRoomIsOpen({isOpen: false}));

      }, 400);

    } else {

      this.tabToOpen = "history";

      this.store.dispatch(changeRoomIsOpen({isOpen: true}));

      setTimeout(() => {
        
        this.store.dispatch(changeRoomMenuStyle({style: {top: "50px"}}))

      }, 1);

    }

  }

  toggleRoomMenuRooms () {

    if (this.roomMenuIsOpen === true) {

      this.store.dispatch(changeRoomMenuStyle({style: {top: "-100vh"}}));

      setTimeout(() => {

        this.store.dispatch(changeRoomIsOpen({isOpen: false}));

      }, 400);

    } else {

      this.tabToOpen = "rooms";

      this.store.dispatch(changeRoomIsOpen({isOpen: true}));

      setTimeout(() => {
        
        this.store.dispatch(changeRoomMenuStyle({style: {top: "50px"}}))

      }, 1);

    }

  }

  ngOnDestroy() {

    this.store.dispatch(ChangePlaylistPanel({style:{bottom: "-100vh"}}));

    this.store.dispatch(changeRoomMenuStyle({style: {top: "-100vh"}}));

    setTimeout(() => {

      this.store.dispatch(changeRoomIsOpen({isOpen: false}));

    }, 400);

  }

  onChatSubmit() {

    if (this.chatForm.valid) {

      this.socket.sendMessage(this.chatForm.value.chat);

      this.chatForm.reset();

    }

  }

  reloadPlayer () {

    this.room.fetchRoom(window.location.pathname.slice(1, window.location.pathname.length)).then(data => {

      if (this.room.getYTPlayerExists()) {

        this.room.destoryPlayer();
  
        this.socket.getRoomTime();

        this.cidToPlay = data.current_dj.song.cid;

        this.durationTOStart = data.current_dj.song.duration;
  
      }

    }).catch(err => {

      console.log(err);

    });

  }

  checkIfUpvotes (): boolean {

    let index = this.upvotes.findIndex(elm => elm === this.id);

    if (index !== -1) {
      return true
    } else {
      return false;
    }

  }

  checkIfDownvotes (): boolean {

    let index = this.downvotes.findIndex(elm => elm === this.id);

    if (index !== -1) {
      return true
    } else {
      return false;
    }

  }

  ngAfterViewInit(): void {
    
    let volval = window.localStorage.getItem("volume");

    if (volval) {

      this.volume.nativeElement.value = parseInt(volval);

    }

  }

}
