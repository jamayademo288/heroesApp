import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/environments/environments';
import { catchError, map, Observable, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';

@Injectable({ providedIn: 'root'})
export class HeroService {

  private readonly API_URL: string = environments.baseUrl;;

  constructor(private httpClient: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(`${this.API_URL}/heroes`);
  }

  getHeroById(id: string): Observable<Hero|undefined> {
    return this.httpClient.get<Hero|undefined>(`${this.API_URL}/heroes/${id}`)
      .pipe(
        catchError( err => of( undefined ) )
      )
  }

  getSuggestions( query: string ): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(`${this.API_URL}/heroes?query=${query}`);
  }

  addHero( hero: Hero ): Observable<Hero> {
    return this.httpClient.post<Hero>(`${this.API_URL}/heroes`, hero);
  }

  updateHero( hero: Hero ): Observable<Hero> {
    if( !hero.id ) throw new Error('No existing hero')
    return this.httpClient.patch<Hero>(`${this.API_URL}/heroes/${hero.id}`, hero);
  }

  deleteHero( id: string ): Observable<boolean> {
    return this.httpClient.delete(`${this.API_URL}/heroes/${ id }`)
      .pipe(
        map( resp => true ),
        catchError( err => of( false ) )
      )
  }
}
