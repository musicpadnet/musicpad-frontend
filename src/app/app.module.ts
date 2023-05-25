import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from "@ngrx/store";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { AppReducer } from './store/app.reducer';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {LoginDialogComponent} from "./components/login-dialog/login-dialog.component";
import {MatInputModule} from '@angular/material/input';
import {SingupDialogComponent} from './components/signup-dialog/signup-dialog.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ReactiveFormsModule} from '@angular/forms';
import { SpinnerComponent } from './spinner/spinner.component';
import { CreatePlaylistDialog } from './components/create-playlist-dialog/create-playlist-dialog.component'; 
import { CreateRoomDialog } from './components/create-room-dialog/create-room-dialog.component';
import { ScrollingModule } from "@angular/cdk/scrolling";

@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent,
    LoginDialogComponent,
    SingupDialogComponent,
    SpinnerComponent,
    CreatePlaylistDialog,
    CreateRoomDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({app: AppReducer}),
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    ScrollingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
