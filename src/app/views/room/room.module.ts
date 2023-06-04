import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomRoutingModule } from './room-routing.module';
import { RoomComponent } from './room.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button"
import {MatTabsModule} from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from "@angular/cdk/scrolling";
import { SpinnerModule } from 'src/app/spinner/spinner.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    RoomComponent
  ],
  imports: [
    CommonModule,
    RoomRoutingModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    ReactiveFormsModule,
    ScrollingModule,
    SpinnerModule,
    DragDropModule,
    MatMenuModule,
    MatSnackBarModule
  ]
})
export class RoomModule { }
