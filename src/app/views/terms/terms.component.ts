import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'm-app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  ngOnInit(): void {
    
    document.title = "Mixzy - Terms Of Service"

  }

}
