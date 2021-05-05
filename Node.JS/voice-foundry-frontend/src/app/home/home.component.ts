import { Component, OnInit } from '@angular/core';
import { RestAPIService } from '../rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public items: Array<any> = [];

  constructor(private rest: RestAPIService) { 
    console.log(this.items);
    
  }

  ngOnInit(): void {
    this.rest.getTopFiveVanity().subscribe((returned: any) => {
      this.items = returned;
    })
    
  }

}
