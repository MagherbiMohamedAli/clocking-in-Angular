import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Aos from 'aos';

@Component({
  selector: 'app-my-absence',
  templateUrl: './my-absence.component.html',
  styleUrls: ['./my-absence.component.css']
})
export class MyAbsenceComponent implements OnInit {
  absenceInfo: any = null;
  displayedColumns: string[] = ['nom', 'type', 'dateStart', 'dateEnd', 'numberOfDays', 'description', 'status'];
  dataSource: any[] = [];
  
  // For projects
  projectsDataSource: any[] = [];
  projectDisplayedColumns: string[] = ['title', 'description', 'clientName', 'startDate', 'endDate', 'members'];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    Aos.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true
    });
    this.getMyAbsence();
    this.getMyProjects();
  }

  getMyAbsence(): void {
    this.http.get('https://clocking-in-spring-boot-production.up.railway.app/api/abs/my-absence').subscribe(
      (data: any) => {
        this.absenceInfo = data;

        if (data) {
          this.absenceInfo = data;
          this.dataSource = [data]; 
        }
      },
      (error) => {
        console.error('Error fetching absence info', error);
      }
    );
  }

  // Fetch the projects assigned to the logged-in user
  getMyProjects(): void {
    const userId = localStorage.getItem('AuthUserId'); // Assuming userId is stored in localStorage
    this.http.get(`https://clocking-in-spring-boot-production.up.railway.app/api/projects/user/${userId}`).subscribe(
      (data: any) => {
        this.projectsDataSource = data; // Set the dataSource for the projects table
      },
      (error) => {
        console.error('Error fetching projects info', error);
      }
    );
  }

  // Method to return class based on status
  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'status-approved';
      case 'Pending':
        return 'status-pending';
      case 'Denied':
        return 'status-denied';
      default:
        return '';
    }
  }

  // Utility method to get the names of project members
  getMemberNames(members: any[]): string {
    return members.map(member => `${member.nom} ${member.prenom}`).join(', ');
  }
}
