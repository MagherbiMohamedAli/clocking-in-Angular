import { Component } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  connecter!: Boolean;
  constructor(private localSt: LocalStorageService, private route: Router) {
    if (localSt.isLoggedIn()) {
      this.connecter = true;
    } else {
      this.connecter = false;
    }
  }
  isLoggedIn(){
    return this.localSt.isLoggedIn();
  }
  signOut() {
    this.localSt.Signout();
    this.connecter = false;
    this.route.navigate(["login"]);
  }
  isAdmin(): boolean {
    const authUser = localStorage.getItem('AuthUser');
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.roles.some((role: any) => role.role === 'ROLE_ADMIN');
    }
    return false;
  }
}
