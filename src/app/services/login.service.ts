import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { LoginModel } from '../models/login-model';

export interface LoginResponse {
  token: string;
  expiresIn: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly apiUrl = environment.apiUrl;

  private toggleLoggedIn = new BehaviorSubject<boolean>(false)
  $toggleLoggedIn = this.toggleLoggedIn.asObservable()

  constructor(private http: HttpClient, private router: Router) {}

  setToggleLoggedIn(value: boolean): void {
    this.toggleLoggedIn.next(value)
  }

  isLoggedin(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  login(credentials: LoginModel): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/admin`, credentials, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(tap((res: LoginResponse) => {
        this.setCache(res.token)
        this.setToggleLoggedIn(true)
      }));
  }

  setCache(token: string): void {
    localStorage.setItem('token', token);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.setToggleLoggedIn(false)
    this.router.navigate(['/admin/login']);
  }
}
