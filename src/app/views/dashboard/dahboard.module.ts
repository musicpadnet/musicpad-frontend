import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DahboardRoutingModule } from './dahboard-routing.module';
import { DahboardComponent } from './dahboard.component';
import { MatButtonModule } from "@angular/material/button";
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';


@NgModule({
  declarations: [
    DahboardComponent
  ],
  imports: [
    CommonModule,
    DahboardRoutingModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule
  ]
})
export class DahboardModule { }
