import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://clocking-in-spring-boot-production.up.railway.app/api/user';

  constructor(private http: HttpClient) { }
  getUserById(id: number){
    return this.http.get("https://clocking-in-spring-boot-production.up.railway.app/api/user/getUserById/"+id);
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>("https://clocking-in-spring-boot-production.up.railway.app/api/user/getAllUsers");
  }
  addUserStatus(userId: number, statusId: number): Observable<void> {
    return this.http.post<void>("https://clocking-in-spring-boot-production.up.railway.app/api/user/add", null, {
      params: { userId: userId.toString(), statusId: statusId.toString() }
    });
  }

  getTimeWorked(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${userId}/total-time`);
  }
}
