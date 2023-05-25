import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./views/dashboard/dahboard.module').then(m => m.DahboardModule) 
  },
  { 
    path: ':slug', 
    loadChildren: () => import('./views/room/room.module').then(m => m.RoomModule) 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
