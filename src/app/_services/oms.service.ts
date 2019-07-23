import { User } from './../_models/user';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OmsService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentToken(): User {
    return this.currentUserSubject.value;
  }

  isloggedin(): boolean {
    return localStorage.getItem('userid') ? true : false;
  }

  login(data) {
    return this.http.post<any>('/api/authenticate', data )
      .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  getOrder() {
    return this.http.get('/api/orders');
  }

  createOrder(data) {
    return this.http.post('/api/orders', data);
  }

  updateOrder(data) {
    return this.http.put('/api/orders', data)
  }

  deleteOrder(data) {
    return this.http.delete('/api/orders', data);
  }

  logout() {
    localStorage.removeItem('userid');
  }

}
