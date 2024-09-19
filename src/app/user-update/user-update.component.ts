import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent implements OnInit{
  updateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any }
  ) {
    this.updateForm = this.fb.group({
      nom: [data.user.nom, [Validators.required]],
      prenom: [data.user.prenom, [Validators.required]],
      email: [data.user.email, [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.updateForm.invalid) {
      return;
    }

    const updatedUser = { ...this.data.user, ...this.updateForm.value };

    this.userService.updateUser(updatedUser.id, updatedUser).subscribe(
      () => {
        Swal.fire('Succès', 'Utilisateur mis à jour avec succès.', 'success');
        this.dialogRef.close(true);
      },
      (error) => {
        Swal.fire('Erreur', 'Échec de la mise à jour de l\'utilisateur.', 'error');
        console.error('Update failed', error);
      }
    );
  }
}
