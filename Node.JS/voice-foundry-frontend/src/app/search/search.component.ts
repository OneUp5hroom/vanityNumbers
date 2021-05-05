import { Component, OnInit } from '@angular/core';
import { RestAPIService } from '../rest-api.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public numbers: Array<any> = [];
  public noneFound = false;
  phoneNumberControl = new FormControl('');
  
  constructor(private rest: RestAPIService) {}

  ngOnInit(): void {
  }
  buttonClick(event: any): void {
    this.rest.getVanity(this.phoneNumberControl.value).subscribe((returned: any) => {
      if (returned !== undefined && returned.length > 0) {
        this.noneFound = false;
        this.numbers = returned;
      } else {
        this.rest.generateVanity(this.phoneNumberControl.value).subscribe((newReturned: any) => {
          if (newReturned.ret === 'success') {
            this.rest.getVanity(this.phoneNumberControl.value).subscribe((returned: any) => {
              if (returned !== undefined && returned.length > 0) {
                this.noneFound = false;
                this.numbers = returned;
              } else {
                this.noneFound = true;
              }
            });
          } else {
            this.noneFound = true;
          }
        });
      }
    });
  }
}