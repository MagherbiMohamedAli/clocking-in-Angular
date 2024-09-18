import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginRequest } from '../model/login-request';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import Swal from 'sweetalert2';
import { AuthResponse } from '../model/auth-response';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  credentialForm!: FormGroup;
  user: any;
  loggedIn: any;
  loginReq = new LoginRequest();
  attempts = 0;
  constructor(private authSer: AuthService,
    private route: Router,
    private localStorage: LocalStorageService,
    private fb: FormBuilder
  ) { }
  login() {
    console.log('Login function called');
    console.log(this.credentialForm.value);

    this.authSer.login(this.credentialForm.value).subscribe({
      next: (data: AuthResponse) => {
        this.authSer.showUserId().subscribe({
          next: (data) => {
            console.log('User data:', data);
          },
          error: (err) => {
            console.error('Error fetching user data:', err);
          }
        });
        this.localStorage.saveToken(data.accessToken);
        this.localStorage.saveUsername(data.username);
        this.localStorage.saveUserId(data.id);
        this.localStorage.saveUser({
          id: data.id,
          email: data.email,
          username: data.username,
          roles: data.roles,
          nom: data.nom,
          prenom: data.prenom
        });
        this.localStorage.saveAuthorities(data.roles);
        if (data.roles[0].role == "ROLE_ADMIN") {
          Swal.fire({
            title: 'Bienvenue admin ' + data.nom + ' ' + data.prenom,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Accéder au menu principal",
            denyButtonText: "Ajouter un utilisateur",
          }).then((result) => {
            if (result.isConfirmed) {
              this.route.navigate(["home"]);

            } else if (result.isDenied) {
              this.route.navigate(["addUsers"]);

            } else {
              this.route.navigate(["login"]);

            }

          })
        } else {
          Swal.fire('Bienvenue ' + data.nom + ' ' + data.prenom)
          this.route.navigate(["/home"]);
        }
      },
      error: (err: any) => {
        Swal.fire("Veuiller vérifier vos coordonnées");
      },
      complete: () => { }
    });
  }


  ngOnInit() {

    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.credentialForm.get('email');
  }
  get password() {
    return this.credentialForm.get('password');
  }

}
