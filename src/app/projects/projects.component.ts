import { Component, OnInit } from '@angular/core';
import { Project } from '../model/project';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectService } from '../services/project.service';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import Aos from 'aos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'title', 'description', 'clientName', 'startDate', 'endDate', 'members', 'actions'];
  dataSource: MatTableDataSource<Project> = new MatTableDataSource();

  constructor(private projectService: ProjectService, private dialog: MatDialog, private userService: UserService) { }

  ngOnInit(): void {
    Aos.init({
      duration: 1000, 
      easing: 'ease-in-out', 
      once: true
    });
    this.loadProjects();
    this.loadUsers();
  }

  loadUsers(): void {
    // Fetch all users to be displayed for assignment in project form
    this.userService.getAllUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  loadProjects() {
    // Load all projects
    this.projectService.getProjects().subscribe(projects => {
      this.dataSource.data = projects;
    });
  }

  createProject(project: Project) {
    // When creating a new project, send full user objects for members
    this.projectService.createProject(project).subscribe(() => {
      this.loadProjects();
    });
  }

  updateProject(project: Project) {
    // When updating, make sure to send full user objects for members
    this.projectService.updateProject(project.id, project).subscribe(() => {
      this.loadProjects();
    });
  }

  deleteProject(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteProject(id).subscribe(() => {
          this.loadProjects(); // Recharger les projets après la suppression
          Swal.fire(
            'Supprimé !',
            'Le projet a été supprimé avec succès.',
            'success'
          );
        });
      }
    });
  }

  openCreateProjectDialog() {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      width: '600px',  
      height: '600px',
      data: { project: {}, users: this.users } // Pass an empty project object and users list for selection
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createProject(result);
      }
    });
  }
  getMemberNames(members: User[]): string {
    return members.map(member => `${member.nom} ${member.prenom}`).join(', ');
  }

  editProject(project: Project) {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      width: '400px',
      data: { project: { ...project }, users: this.users }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateProject(result);
      }
    });
  }
}
