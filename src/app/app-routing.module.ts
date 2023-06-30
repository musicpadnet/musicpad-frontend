import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./views/dashboard/dahboard.module').then(m => m.DahboardModule) 
  },
  { 
    path: 'terms', 
    loadChildren: () => import('./views/terms/terms.module').then(m => m.TermsModule) 
  },
  { 
    path: 'privacy', 
    loadChildren: () => import('./views/privacy/privacy.module').then(m => m.PrivacyModule) 
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
