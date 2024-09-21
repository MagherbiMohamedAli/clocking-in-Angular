import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Aos from 'aos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-absence',
  templateUrl: './add-absence.component.html',
  styleUrl: './add-absence.component.css'
})
export class AddAbsenceComponent implements OnInit{
  abscence = {
    type: '',
    description: '',
    dateStart: '',
    dateEnd: ''
  };
  absenceForm!: FormGroup;
  startDateInvalid = false;
  endDateInvalid = false;

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {}
  ngOnInit(): void {
    Aos.init({
      duration: 1000, 
      easing: 'ease-in-out', 
      once: true
    });
    this.absenceForm = this.fb.group({
      type: ['', Validators.required],
      description: ['', Validators.required],
      dateStart: ['', Validators.required],
      dateEnd: ['', Validators.required]
    });

    this.absenceForm.valueChanges.subscribe(() => {
      this.validateDates();
    });
  }
  onSubmit() {
    if (this.absenceForm.invalid || this.startDateInvalid || this.endDateInvalid) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs correctement.', 'error');
      return;
    }

    const userId = this.getLoggedInUserId();
    const absenceData = this.absenceForm.value;
  
    this.http.post(`https://clocking-in-spring-boot-production.up.railway.app/api/abs/request?userId=${userId}`, absenceData, { observe: 'response', responseType: 'text' }).subscribe(
      (response) => {
        if (response.status === 200) {
          Swal.fire('Success', 'Absence demandée avec succès!', 'success');
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        Swal.fire('Erreur', 'Une erreur inattendue est survenue.', 'error');
      }
    );
  }
  validateDates() {
    const currentDate = new Date().toISOString().split('T')[0];
    const dateStart = this.absenceForm.get('dateStart')?.value;
    const dateEnd = this.absenceForm.get('dateEnd')?.value;

    this.startDateInvalid = dateStart <= currentDate || dateStart >= dateEnd;
    this.endDateInvalid = dateEnd <= dateStart;
  }
  


  getLoggedInUserId(): number {
    const user = JSON.parse(localStorage.getItem('AuthUser')!);
    return user.id;
  }
}
