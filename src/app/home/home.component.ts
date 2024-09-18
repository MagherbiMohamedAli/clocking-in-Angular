import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectedWorkMode: string | null = null;
  entreeStatusId: number | null = null;
  allUsers: any[] = [];
  users: any[] = [];
  statuses: any[] = [];
  selectedUserId: number | null = null;
  selectedStatusId: number | null = null;
  filteredUsers: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['nom', 'tatus', 'time', 'workMode', 'action'];
  loggedInUserId: number | null = null;
  isAdmin: boolean = false;
  totalTimeWorked: number | null = null;
  hasSelectedSelf: boolean = false;

  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    this.loggedInUserId = this.getLoggedInUserId();
    this.fetchUsers();
    this.fetchStatuses();
    this.isAdmin = this.checkIfAdmin();
    if (this.isAdmin) {
      this.displayedColumns = ['nom', 'status', 'time', 'workMode', 'action'];
    } else {
      this.displayedColumns = ['nom', 'status', 'time', 'workMode'];
    }

    this.scheduleFilterAt11_50PM();
  }

  
  checkIfAdmin(): boolean {
    const authUser = localStorage.getItem('AuthUser');
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.roles.some((role: any) => role.role === 'ROLE_ADMIN');
    }
    return false;
  }

  ngAfterViewInit() {
    this.filteredUsers.paginator = this.paginator;
    this.filteredUsers.sort = this.sort;
  }

  fetchUsers(): void {
    this.http.get<any[]>('https://clocking-in-spring-boot-production.up.railway.app/api/user/employees').subscribe(data => {
      this.allUsers = data;
      this.users = data;
      this.filterUsersWithStatus();
    });
  }
  fetchStatuses(): void {
    this.http.get<any[]>('https://clocking-in-spring-boot-production.up.railway.app/api/status/all').subscribe(data => {
      this.statuses = data;
  
      const entreeStatus = this.statuses.find(status => status.status === 'ENTREE');
      if (entreeStatus) {
        this.entreeStatusId = entreeStatus.id;
      }
    });
  }
  

  onSubmit(): void {
    if (this.selectedStatusId && this.selectedUserId) {
      const requestData: any = {
        statusId: this.selectedStatusId
      };
  
      if (this.selectedStatusId === this.entreeStatusId && this.selectedWorkMode) {
        requestData.workMode = this.selectedWorkMode;
      }
  
      this.userService.addUserStatus(this.selectedUserId, requestData).subscribe({
        next: () => {
          this.fetchUsers();
        },
        error: (err) => {
          console.error('Error adding user status:', err);
        }
      });
    }
  }

  getLoggedInUserId(): number | null {
    const authUser = localStorage.getItem('AuthUser');
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.id;
    }
    return null;
  }

  shouldShowButton(): boolean {
    return this.selectedUserId === this.loggedInUserId || this.isAdmin;
  }

  filterUsersWithStatus(): void {
    const filteredData = this.allUsers.filter(user => user.status);
    this.filteredUsers.data = filteredData;
    this.filteredUsers.paginator = this.paginator;
    this.filteredUsers.sort = this.sort;
  }


  formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    let result = `${hours} heure${hours !== 1 ? 's' : ''}`;
    if (remainingMinutes > 0) {
      result += ` ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    }
    if (minutes && hours) {
      result = `${hours}h et ${remainingMinutes}m`;
    }
    return result;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ENTREE':
        return 'status-ENTREE';
      case 'SORTIE':
        return 'status-SORTIE';
      case 'DEJEUNER':
        return 'status-DEJEUNER';
      case 'PAUSE':
        return 'status-PAUSE';
      default:
        return '';
    }
  }

  getTotalTime(userId: number): void {
    this.userService.getTimeWorked(userId).subscribe(
      (time) => {
        const formattedTime = this.formatTime(time);

        Swal.fire({
          title: 'Temps Total Travaillé',
          html: `
            <p>Cet utilisateur a travaillé un total de ${formattedTime}.</p>
          `,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Générer PDF',
          cancelButtonText: 'Annuler',
        }).then((result) => {
          if (result.isConfirmed) {
            this.generatePDF(userId, formattedTime);
          }
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération du temps total:', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de récupérer le temps total travaillé.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  generatePDF(userId: number, formattedTime: string): void {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.text(`Rapport de Temps Travaillé`, 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Id de l'utilisateur: ${userId}`, 10, 40);
    doc.text(`Date: ${date}`, 10, 50);

    autoTable(doc, {
      startY: 60,
      head: [['Description', 'Détails']],
      body: [
        ['Total de temps travaillé', formattedTime],
        ['Date du rapport', date],
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 60 },
    });

    doc.setFontSize(10);
    doc.text('Généré automatiquement par le système.', 105, doc.internal.pageSize.height - 10, { align: 'center' });
    doc.save(`Rapport_Temps_Travail_User_${userId}_${date}.pdf`);
  }

  displayMinutesButton(userId: number): boolean {
    if (this.isAdmin) {
      return true;
    }
    return this.hasSelectedSelf && userId === this.loggedInUserId;
  }

  onUserSelect(): void {
    this.hasSelectedSelf = this.selectedUserId === this.loggedInUserId;
  }

  hasAdminRole(): boolean {
    const authUser = localStorage.getItem('AuthUser');
    if (authUser) {
      const user = JSON.parse(authUser);
      return user.roles.some((role: any) => role.role === 'ROLE_ADMIN');
    }
    return false;
  }

  fetchTotalTimeForAllUsers(): void {
    this.http.get<any[]>('https://clocking-in-spring-boot-production.up.railway.app/api/user/all/total-time').subscribe(data => {
      this.generatePDFForAllUsers(data);
    });
  }

  generatePDFForAllUsers(totalTimeMap: any): void {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.text(`Rapport de Temps Travaillé pour Tous les Utilisateurs`, 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 10, 40);
    autoTable(doc, {
      startY: 50,
      head: [['User ID', 'Nom', 'Prénom', 'Total de Temps Travaillé']],
      body: Object.keys(totalTimeMap).map(userId => {
        const user = this.allUsers.find(u => u.id === +userId);
        const formattedTime = this.formatTime(totalTimeMap[userId]);
        return [userId, user.nom, user.prenom, formattedTime];
      }),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 50 },
    });
    doc.setFontSize(10);
    doc.text('Généré automatiquement par le système.', 105, doc.internal.pageSize.height - 10, { align: 'center' });
    doc.save(`Rapport_Temps_Travail_Tous_Utilisateurs_${date}.pdf`);
  }

  isStatusNotSortie(status: string): boolean {
    return status !== "SORTIE";
  }

  filterUsersWithoutSortie(): void {
    // Filter out users with the 'SORTIE' status
    const filteredData = this.allUsers.filter(user => user.status && user.status.status !== 'SORTIE');
    this.filteredUsers.data = filteredData;
    this.filteredUsers.paginator = this.paginator;
    this.filteredUsers.sort = this.sort;
  }
  scheduleFilterAt11_50PM(): void {
    const now = new Date();
    const targetTime = new Date();

    targetTime.setHours(23, 50, 0, 0);

    if (now.getTime() > targetTime.getTime()) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const timeUntil11_50PM = targetTime.getTime() - now.getTime();

    setTimeout(() => {
      this.filterUsersWithoutSortie();
      setInterval(() => {
        this.filterUsersWithoutSortie();
      }, 24 * 60 * 60 * 1000);
    }, timeUntil11_50PM);
  }

}
