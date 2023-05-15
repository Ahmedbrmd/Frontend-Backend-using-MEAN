import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(public router : Router , public authService: AuthService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isAuth = this.authService.isAuthed();
      if(!isAuth){
          this.router.navigate(["/login"])
      }
     return isAuth || false; 
  }
  
}
