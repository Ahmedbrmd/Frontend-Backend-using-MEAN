import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class RoleGuard  {
 constructor(private authService : AuthService ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const role = this.authService.getAuthData().roles.includes('admin');
      return role;
  }
  
}
