import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { Observable } from 'rxjs';

@Component({
  selector: 'm-app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent {

  app$: Observable<{loadingError: boolean, socketLoadingError: boolean}>

  error: boolean = false;

  websocketError: boolean = false;

  constructor (private store: Store<{app: {loadingError: boolean, socketLoadingError: boolean}}>) {

    this.app$ = store.select("app");

    this.app$.subscribe({
      next: (state) => {
        this.error = state.loadingError;
        this.websocketError = state.socketLoadingError;
      }
    });

  }

}
