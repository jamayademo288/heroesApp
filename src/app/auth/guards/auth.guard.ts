import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { catchError, map, Observable, tap } from 'rxjs';
import { AuthService } from '../services/aut.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanMatch, CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  private checkAuthStatus(): Observable<boolean> | Promise<boolean> | boolean{
    return this.authService.checkAuth()
      .pipe(
        tap( isAuth => {
          if( !isAuth ) {
            this.router.navigate(['./auth/login']);
          }
        })
      )
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // console.log('canActivate');
    // console.log({ route, state});
    return this.checkAuthStatus();
  }

  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    // console.log('canMatch');
    // console.log({ route, segments });
    return this.checkAuthStatus();
  }

}
