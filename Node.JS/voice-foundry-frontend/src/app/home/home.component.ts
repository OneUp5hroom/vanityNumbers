import { Component, OnInit } from '@angular/core';
import { RestAPIService } from '../rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public items: Array<any> = [];
  public uniqueItems = new Set();
  public isHidden: Array<boolean> = [];
  public itemObjects: Array<any> = [];
  constructor(private rest: RestAPIService) { 
    console.log(this.items);
    
  }

  ngOnInit(): void {
    this.rest.getTopFiveVanity().subscribe((returned: any) => {
      this.items = returned;
      this.items.forEach(e => {
        this.uniqueItems.add(e.parentNumber);
      });
      this.uniqueItems.forEach(n => {
        // formatting number to make it look nicer.
        let num = String(n).slice(0,3) + '-' + String(n).slice(3,6) + '-' + String(n).slice(6,10);
        let output = {
          parentNumber: String(n),
          formattedNumber: num
        }
        console.log(output);
        this.itemObjects.push(output);
      });
      for (let i=0; i < this.uniqueItems.size; i++) {
        this.isHidden[i] = true;
      }
    })
  }
  buttonClick(event: any): void {
    if (this.isHidden[event.srcElement.id] === false) {
      this.isHidden[event.srcElement.id] = true;
    } else {
        this.isHidden[event.srcElement.id] = false;
    }
  }
}
