import { Component } from '@angular/core';
import { LocalStorageService } from './services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showNavbar: boolean = true;
  constructor(private lss: LocalStorageService, private router: Router){
    this.router.events.subscribe(() => {
      // Hide the navbar if the route is "/login" or other auth-related routes
      this.showNavbar = this.router.url !== '/login' && this.router.url !== '/register';
    });
  }
  
  isLoggedIn(){
    return this.lss.isLoggedIn();
  }
  title = 'pointage';
}
