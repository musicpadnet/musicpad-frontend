import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from "@ngrx/store";
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { AppService } from './services/app.service';

@Component({
  selector: 'm-app-mount',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mixtrack-web';

  app$: Observable<{loaderStyle: {opacity: number}, isLoaded: boolean}>;

  isLoaded: boolean = false;

  loaderStyle: {opacity: number} = {opacity: 1};

  constructor (private store: Store<{app: { isLoaded: boolean, loaderStyle: {opacity: number}}}>, private http: HttpClient, private auth: AuthService, private app: AppService) {
    this.app$ = store.select("app");

    this.app$.subscribe({
      next: (state) => {
        this.isLoaded = state.isLoaded;
        this.loaderStyle = state.loaderStyle
      }
    })
    
  }

  async ngOnInit(): Promise<void> {

    await this.app.initiateApplicationCoreBundles();

  }

}