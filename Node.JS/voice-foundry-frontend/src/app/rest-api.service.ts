import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestAPIService {
  private baseUrl = environment.url;

  constructor(private httpClient: HttpClient) { 
    console.log('getAPIData');
  }

  public getVanity(phoneNumber: string): Observable<Object> {
    const queryUrl = this.baseUrl + "?phoneNumber=" + phoneNumber + '&webSource=true';
    const response = this.httpClient.get(queryUrl);
    return response;
  }
  public getLastFiveVanity(): Observable<Object> {
    const queryUrl = this.baseUrl + '/topfive';
    const response = this.httpClient.get(queryUrl);
    return response;
  }
  public generateVanity(phoneNumber: string): Observable<Object> {
    const queryUrl = this.baseUrl;
    const body = {
      "phoneNumber": phoneNumber
    }
    const response = this.httpClient.post(queryUrl, body);
    return response;
  }
}
