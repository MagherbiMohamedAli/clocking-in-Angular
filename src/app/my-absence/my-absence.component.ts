import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-absence',
  templateUrl: './my-absence.component.html',
  styleUrl: './my-absence.component.css'
})
export class MyAbsenceComponent implements OnInit{
  absenceInfo: any = null;
  displayedColumns: string[] = ['nom', 'type', 'dateStart', 'dateEnd', 'numberOfDays', 'description', 'status'];
  dataSource: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getMyAbsence();
  }

  getMyAbsence(): void {
    this.http.get('https://clocking-in-spring-boot-production.up.railway.app/api/abs/my-absence').subscribe(
      (data: any) => {
        this.absenceInfo = data;

        if (data) {
          this.dataSource = [data]; // Put the absence info in the dataSource array for the table
        }
      },
      (error) => {
        console.error('Error fetching absence info', error);
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
}
