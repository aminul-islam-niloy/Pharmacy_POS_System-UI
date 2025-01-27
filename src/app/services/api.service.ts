import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://localhost:7083/api'; 

  constructor(private http: HttpClient) {}

  getBrands(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Brand`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Category`);
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Product`);
  }

  addOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Order`, order);
  }

 
}
