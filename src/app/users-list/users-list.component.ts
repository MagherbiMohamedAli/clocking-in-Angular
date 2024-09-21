import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { UserUpdateComponent } from '../user-update/user-update.component';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from '../services/user.service';
import Aos from 'aos';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit{
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['nom', 'prenom', 'email', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnInit(): void {
    Aos.init({
      duration: 1000, 
      easing: 'ease-in-out', 
      once: true
    });
    this.getAllUsers();
    this.dataSource.paginator = this.paginator;
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(
      (data: any[]) => {
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  confirmDelete(user: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas annuler cela!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non, annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser(user.id);
      }
    });
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe(
      () => {
        Swal.fire('Supprimé!', 'L\'utilisateur a été supprimé.', 'success');
        this.getAllUsers();
      },
      (error) => {
        Swal.fire('Erreur', 'Une erreur est survenue.', 'error');
      }
    );
  }

  openUpdateDialog(user: any) {
    const dialogRef = this.dialog.open(UserUpdateComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUsers();
      }
    });
  }
}
