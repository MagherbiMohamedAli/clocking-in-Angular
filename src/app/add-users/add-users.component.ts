import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.css'
})
export class AddUsersComponent implements OnInit{
  credentialForm!: FormGroup;

  constructor(
    private authServ: AuthService,
    private route: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
     confirmPassword: ['', [Validators.required]],
     nom: ['', [Validators.required]],
     prenom: ['', [Validators.required]]

   }, 
    {
      validator: this.passwordMatchValidator 
    });
  }
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  signup() {
    if (this.credentialForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulaire invalide',
        text: 'Veuillez vérifier les champs du formulaire.',
      });
      return;
    }

    this.authServ.signup(this.credentialForm.value).subscribe({
      next: (data: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Ajouté avec succès!',
          text: 'Bienvenue dans Biram-Groupe',
        });
        this.route.navigate(['home']);
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur dans un ou plusieurs champs du formulaire',
        });
        console.error('API Error:', err);
      }
    });
  }

  get email() {
    return this.credentialForm.get('email');
  }

  get password() {
    return this.credentialForm.get('password');
  }
  get confirmPassword() {
    return this.credentialForm.get('confirmPassword');
  }
  get nom() {
    return this.credentialForm.get('nom');
  }
  get prenom() {
    return this.credentialForm.get('prenom');
  }
}
