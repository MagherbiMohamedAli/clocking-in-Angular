import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-abs',
  templateUrl: './manage-abs.component.html',
  styleUrl: './manage-abs.component.css'
})
export class ManageAbsComponent implements OnInit{
  absences: any[] = [];
  filteredAbsences = new MatTableDataSource<any>();
  selectedStatus: string | null = 'pending';
  displayedColumns: string[] = ['nom', 'type', 'dateStart', 'dateEnd', 'days', 'description','action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.filteredAbsences.paginator = this.paginator;
    this.filteredAbsences.sort = this.sort;
    this.fetchPendingAbsences()
  }
  approveAbsence(absenceId: number, accepted: boolean): void {
    this.http.put<{ message: string }>(`https://clocking-in-spring-boot-production.up.railway.app/api/abs/${absenceId}/approve?accepted=${accepted}`, null).subscribe(
      (response) => {
        const action = accepted ? 'approved' : 'denied';
        Swal.fire('Success', response.message, 'success');
        this.fetchPendingAbsences();
      },
      (error) => {
        console.error('Error details:', error);
        Swal.fire('Error', 'There was an issue updating the absence status.', 'error');
      }
    );
  }
  
  onStatusSelect(): void {
    if (this.selectedStatus === 'approved') {
      this.displayedColumns = ['nom', 'type', 'dateStart', 'dateEnd', 'days', 'description'];
      this.fetchApprovedAbsences();
    } else if (this.selectedStatus === 'denied') {
      this.displayedColumns = ['nom', 'type', 'dateStart', 'dateEnd','days', 'description'];
      this.fetchDeniedAbsences();
    } else if (this.selectedStatus === 'pending') {
      this.displayedColumns = ['nom', 'type', 'dateStart', 'dateEnd','days', 'description', 'action'];
      this.fetchPendingAbsences();
    }
  }
  

  fetchApprovedAbsences(): void {
    this.http.get<any[]>('https://clocking-in-spring-boot-production.up.railway.app/api/abs/approved').subscribe(data => {
      this.absences = data;
      this.filterAbsences();
    });
  }

  fetchDeniedAbsences(): void {
    this.http.get<any[]>('https://clocking-in-spring-boot-production.up.railway.app/api/abs/denied').subscribe(data => {
      this.absences = data;
      this.filterAbsences();
    });
  }

  fetchPendingAbsences(): void {
    this.http.get<any[]>('https://clocking-in-spring-boot-production.up.railway.app/api/abs/pending').subscribe(data => {
      this.absences = data;
      this.filterAbsences();
    });
  }

  filterAbsences(): void {
    this.filteredAbsences.data = this.absences;
    this.filteredAbsences.paginator = this.paginator;
    this.filteredAbsences.sort = this.sort;
  }

  calculateDaysDifference(dateStart: string, dateEnd: string): number {
  const startDate = new Date(dateStart);
  const endDate = new Date(dateEnd);
  
  const timeDiff = endDate.getTime() - startDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return daysDiff;
}

}
