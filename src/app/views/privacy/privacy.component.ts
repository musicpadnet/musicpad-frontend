import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'm-app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  ngOnInit(): void {
    
    document.title = "Mixzy - Privacy Policy"

  }

}
