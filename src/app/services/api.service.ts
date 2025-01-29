import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://localhost:7083/api';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getBrands(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Brand`, this.httpOptions);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Category`, this.httpOptions);
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Product`, this.httpOptions);
  }

  addProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/Product`, formData);
  }

  getProductImageUrl(productId: number): string {
    return `${this.baseUrl}/Product/${productId}/image`;
  }

  saveOrder(orderData: Order) {
    return this.http.post(`${this.baseUrl}/Order/save-order`, orderData);
  }

}
