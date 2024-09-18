import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const localStor = inject(LocalStorageService);
  const router = inject(Router);

  const roles = localStor.getAuthorities() || [];
  const isLoggedIn = localStor.isLoggedIn();
  const isTokenValid = !localStor.isTokenExpired();

  if (isLoggedIn && isTokenValid && roles.length > 0 && (roles[0].role === "ROLE_EMPLOYEE" || roles[0].role === "ROLE_ADMIN")) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
