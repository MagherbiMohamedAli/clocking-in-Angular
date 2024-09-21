import { Component } from '@angular/core';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private lss: LocalStorageService){}
  isLoggedIn(){
    return this.lss.isLoggedIn();
  }
  title = 'pointage';
}
