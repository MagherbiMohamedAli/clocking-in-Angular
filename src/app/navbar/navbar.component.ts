import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  connecter!: Boolean;
  constructor(private localSt: LocalStorageService, private route: Router) {
    if (localSt.isLoggedIn()) {
      this.connecter = true;
    } else {
      this.connecter = false;
    }
  }
  ngOnInit(): void {
    this.getUsername();
  }
  isLoggedIn(){
    return this.localSt.isLoggedIn();
  }
  signOut() {
    this.localSt.Signout();
    this.route.navigate(['/login']);
  }
  
  getUsername(){
    const user = this.localSt.getUser();
    if(user){
    return this.localSt.getUser().prenom + " " +this.localSt.getUser().nom.toUpperCase();
    }
    else{
      return null;
    }
  }
  isAdmin(): boolean {
    const authUser = localStorage.getItem('AuthUser');
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.roles.some((role: any) => role.role === 'ROLE_ADMIN');
    }
    return false;
  }
  isEmp(): boolean {
    const authUser = localStorage.getItem('AuthUser');
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.roles.some((role: any) => role.role === 'ROLE_EMPLOYEE');
    }
    return false;
  }
}
