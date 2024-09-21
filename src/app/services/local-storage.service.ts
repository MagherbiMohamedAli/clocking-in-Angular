import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { jwtDecode } from 'jwt-decode';

const USER_ID_KEY = 'AuthUserId';
const AUTHORITIES_KEY = 'AuthAuthorities';
const USER_KEY = 'AuthUser';
const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUsername';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private roles: Array<string> = [];
  constructor(private route: Router) { }
  Signout() {
    localStorage.clear();
    //this.route.navigate(['']);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY); 
  }

  public saveToken(token: string) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getUsername(): string {
    return localStorage.getItem(USERNAME_KEY)!;
  }

  public saveUsername(username: string) {
    window.localStorage.removeItem(USERNAME_KEY);
    window.localStorage.setItem(USERNAME_KEY, username);
  }

  public getUserId(): number {
    return Number(localStorage.getItem(USER_ID_KEY)!);
  }

  public saveUserId(userId: number) {
    window.localStorage.removeItem(USER_ID_KEY);
    window.localStorage.setItem(USER_ID_KEY, userId.toString());
  }

  public getUser(): any {
    return JSON.parse(localStorage.getItem(USER_KEY)!);
  }

  public saveUser(user: User): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getAuthorities(): any[] {
    const authorities = localStorage.getItem(AUTHORITIES_KEY);
    return authorities ? JSON.parse(authorities) : [];
  } 

  public saveAuthorities(authorities: any) {
    window.localStorage.removeItem(AUTHORITIES_KEY);
    window.localStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public isLoggedIn() {
    return !!this.getToken();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true; 
    }
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp === undefined) {
        return false;
      }
      const tokenExpDate = new Date(0).setUTCSeconds(decoded.exp);
      return tokenExpDate < new Date().getTime();
    } catch (error) {
      console.error('Invalid token:', error);
      return true; 
    }
  }

}
