import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestAPIService {
  private baseUrl = environment.url;

  constructor(private httpClient: HttpClient) {
  }

  
  public getVanity(phoneNumber: string): Observable<Object> {
    const queryUrl = this.baseUrl + "?phoneNumber=" + phoneNumber + '&webSource=true';
    const response = this.httpClient.get(queryUrl);
    return response;
  }

  public getTopFiveVanity(): Observable<Object> {
    const queryUrl = this.baseUrl + '/topfive';
    const response = this.httpClient.get(queryUrl);
    console.log(response);
    return response;
  }

  public generateVanity(phoneNumber: string): Observable<Object> {
    const queryUrl = this.baseUrl;
    const body = {
      "phoneNumber": phoneNumber
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
      const response = this.httpClient.post(queryUrl, body, httpOptions);
      return response;
  }
}
