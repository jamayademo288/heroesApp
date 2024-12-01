import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  get currentUser(): User | undefined {
    if( !this.user ) return undefined;
    return structuredClone(this.user);
  }

  login( username: string, password: string ): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/1`)
     .pipe(
        tap( (user: User) => {
          this.user = user;
        }),
        tap( (user: User) => {
          localStorage.setItem( 'token', user.id );
        })
      );
  }

  checkAuth(): Observable<boolean> {

    if( !localStorage.getItem('token') ) return of(false);
    const token = localStorage.getItem('token');
    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap( user => this.user ),
        map( user => !!user ),
        catchError( error => of(false))
      )
  }

  logout() {
    this.user = undefined;
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

}
