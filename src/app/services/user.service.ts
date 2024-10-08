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
    return this.http.get<User[]>("https://clocking-in-spring-boot-production.up.railway.app/api/user/employees");
  }
  addUserStatus(userId: number, requestData: any): Observable<any> {
    return this.http.post(`https://clocking-in-spring-boot-production.up.railway.app/api/user/${userId}/status`, requestData);
  }
  
  getTimeWorked(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${userId}/total-time`);
  }
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`https://clocking-in-spring-boot-production.up.railway.app/api/user/delete/${userId}`);
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put<any>(`https://clocking-in-spring-boot-production.up.railway.app/api/user/update/${userId}`, userData);
  }
}
