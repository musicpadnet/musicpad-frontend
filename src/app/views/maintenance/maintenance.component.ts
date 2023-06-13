import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'm-app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  constructor(private http: HttpClient, private config: ConfigService) {}

  ngOnInit(): void {
    
    this.http.get(this.config.conifgAPIURL).subscribe({
      next: () => {

        document.location.replace("/");

      },
      error: () => {

        document.title = "Musicpad - Maintenance Mode";

      }
    });

  }

}
