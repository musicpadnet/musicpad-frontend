import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomRoutingModule } from './room-routing.module';
import { RoomComponent } from './room.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button"
import {MatTabsModule} from '@angular/material/tabs';
import { PlaylistComponent } from '../../components/playlist/playlist.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from "@angular/cdk/scrolling";

@NgModule({
  declarations: [
    RoomComponent,
    PlaylistComponent
  ],
  imports: [
    CommonModule,
    RoomRoutingModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    ReactiveFormsModule,
    ScrollingModule
  ]
})
export class RoomModule { }
