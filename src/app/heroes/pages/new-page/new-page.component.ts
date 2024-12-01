import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('', { nonNullable: true }),
    publisher:        new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', name: 'DC - Comics' },
    { id: 'Marvel Comics', name: 'Marvel - Comics' },
  ]

  constructor(
    private heroService: HeroService,
    private ActivatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if( !this.router.url.includes('edit') ) return;

    this.ActivatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroService.getHeroById( id ) ),
      ).subscribe( hero => {
        if( !hero ) return this.router.navigate(['/']);

        this.heroForm.reset(hero);
        return
      })
  }

  // get currentHero(): Hero {
  //   const hero = this.heroForm.value as Hero;
  //   hero.id = hero.superhero.replace(/\s+/g, '_');

  //   console.log(hero);
  //   return hero;
  // }

  onSubmit() {
    if( this.heroForm.invalid ) return

    if( this.currentHero.id ) {
      this.heroService.updateHero( this.currentHero )
      .subscribe( resp => {
        this.showSnackbar(`${ resp.superhero } updated successfully`)
      });

      return;
    }

    const hero = this.heroForm.value as Hero;
    hero.id = hero.superhero.replace(/\s+/g, '_');

    this.heroService.addHero( hero )
     .subscribe( resp => {
      this.showSnackbar(`${ resp.superhero } created successfully`)
      });
  }

  onDeleteHero() {
    if( !this.currentHero.id ) throw new Error('Hero not found')
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
      .pipe(
        filter( ( result: boolean ) => result ),
        switchMap( () => this.heroService.deleteHero( this.currentHero.id ) ),
        filter( ( resultDeleted: boolean ) => resultDeleted ),
      )
      .subscribe(result => {
        this.router.navigate(['/heroes']);
    })

    // dialogRef.afterClosed().subscribe(result => {
    //   if( !result ) return;

    //   this.heroService.deleteHero( this.currentHero.id )
    //     .subscribe( resp => {
    //       this.router.navigate(['/heroes']);
    //       this.showSnackbar('Hero deleted successfully')
    //     })
    // });
  }

  showSnackbar( message: string ){
    this.snackbar.open( message, 'Done', {
      duration: 2500,
    } );
  }
}
