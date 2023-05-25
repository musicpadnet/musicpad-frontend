import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DahboardComponent } from './dahboard.component';

const routes: Routes = [{ path: '', component: DahboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DahboardRoutingModule { }
