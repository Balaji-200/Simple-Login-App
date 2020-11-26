import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  SERVER: String = "http://192.168.0.105:3000";

  public signup(data): Observable<any> {
    const header = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<User>(`${this.SERVER}/users/signup`, data, { headers: header });
  }

  public login(data): Observable<any> {
    const header = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.SERVER}/users/login`, data, { headers: header });
  }

  public dashboard(): Observable<any> {
    const header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${localStorage.getItem('j')}`);
    return this.http.get(`${this.SERVER}/users/dashboard`, { headers: header });
  }

  public logout():Observable<any>{
    const header = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${localStorage.getItem('j')}`);
    return this.http.get(`${this.SERVER}/users/logout`, { headers: header });
  }
}
