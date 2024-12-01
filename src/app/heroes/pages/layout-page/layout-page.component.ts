import { Component } from '@angular/core';
import { User } from 'src/app/auth/interfaces/user.interface';
import { AuthService } from 'src/app/auth/services/aut.service';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: [
  ]
})
export class LayoutPageComponent {

  public sidebarItems = [
    { label: 'Listado', icon: 'label', route: './list' },
    { label: 'Añadir', icon: 'add', route: './new-hero' },
    { label: 'Buscador', icon: 'search', route: './search-hero' },
  ]

  constructor(
    private authService: AuthService
  ){}

  get user(): User | undefined {
    return this.authService.currentUser;
  }

  onLogout(){
    this.authService.logout();
  }
}
