import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';

export interface IRoomData {
  current_dj: {
    user: string,
    song: {
      title: string,
      duration: number,
      time: number,
      upvotes: number,
      downvotes: number,
      thumbnail: string,
      grabs: number
    }
  },
  users: string[],
  id: string,
  name: string,
  slug: string,
  queue_cycle?: boolean,
  queue_locked?: boolean,
  welcome_message?: string,
  description?: string,
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient, private router: Router, private config: ConfigService) { }

  fetchRoom (slug: string): Promise<IRoomData> {

    const promise = new Promise<IRoomData>((resolve, reject) => {

      this.http.get<IRoomData>(`${this.config.conifgAPIURL}rooms/@/${slug}`).subscribe({
        next: (data: IRoomData) => {
          resolve(data);
        },
        error: (error) => {
          
          if (error.status === 404) {

            this.router.navigate(["/"]);

          }

          reject(error);

        }

      });

    });

    return promise;

  }

}
