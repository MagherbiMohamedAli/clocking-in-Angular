import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { LoginRequest } from '../model/login-request';
import { AuthResponse } from '../model/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  private baseUrl = 'https://clocking-in-spring-boot-production.up.railway.app/auth';
  credentialForm!: FormGroup;
  private userRolesSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  constructor(private http: HttpClient, private fb: FormBuilder, private userService: UserService, private localSt: LocalStorageService, private route: Router) {
    if (this.localSt.isLoggedIn()) {
      this.loadUserRoles();
    }
  }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  showUserId() {
    return this.userService.getUserById(this.localSt.getUserId());
  }

  public loadUserRoles() {
    this.userService.getUserById(this.localSt.getUserId()).subscribe({
      next: (data: any) => {
        const roles = data.roles.map((r: any) => r.role);
        this.userRolesSubject.next(roles);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getUserRoles(): Observable<string[]> {
    console.log(this.userRolesSubject.value);
    return this.userRolesSubject.asObservable();
  }

  get email() {
    return this.credentialForm.get('email');
  }

  signup(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/signup`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  login(loginReq: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, loginReq);
  }
}
