import { SuccessComponent } from './../components/success/success.component';

import jwt_decode from 'jwt-decode';
import {FormGroup} from '@angular/forms';
import { User } from '../model/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';


@Injectable({
  providedIn: 'root'
  
})
export class AuthService {
  private apiBaseUrl = "http://localhost:3001/api";
  private _loginUrl = "http://localhost:3001/api/login";
  private _SignuUpUrl = "http://localhost:3001/api/users/signup";
  private _BaseUrl = "http://localhost:3001/api/users/signup/requests";
  private _DeleteUrl = "http://localhost:3001/api/users/delete/:id"
  private _id = "http://localhost:3001/api/users/:id"
  isAuthenticated?: boolean;
  private userId: string;
  private roles: String;
  public user: User;
  private token?: string;
  private authStatusListener = new Subject<boolean>();
  file: any;
  image: any;

  constructor(private http: HttpClient,
             private router: Router,
              public dialog: MatDialog ) { }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId(userID: string): Observable<User> {
    const url = `${this.apiBaseUrl}/users/${userID}`;
    return this.http.get<User>(url);
  }
  

  loginUser(user: any) {
    this.http.post<User>(this._loginUrl, user).subscribe(
      response => {
        console.log(response);
        this.token = response.token;
        if (this.token) {
          this.setAuthTimer(response.expiresIn);
          
          this.userId = response._id;
          console.log(this.userId);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + response.expiresIn * 1000);
          this.saveAuthData(this.token, expirationDate);
          this.authStatusListener.next(true);
  
          this.user = this.getUser(response.token);
          
          const role = this.getAuthData().roles.includes('admin');
          if (role){

          this.router.navigate(['/dashboard']);}
          else {
            this.router.navigate(['/users']);
          }
        } 
      },
      error => {
        if (error.status === 404) {
          console.error('An error occurred:', error);
          const dialogRef = this.dialog.open(ErrorDialogComponent, {
            data: { message: 'Invalid email or password' },
          });
        }
        else if (error.status === 502){
          const dialogRef = this.dialog.open(ErrorDialogComponent, {
            data: { message: 'Not authorized , waiting for confirmation' },
          });
        }
      },
      
    );
    return this.token;
  }
  
  
  
  
  isAuthed():boolean{
    return localStorage.getItem('token')!=undefined;
}



  signup(form: FormGroup, file : File) {
    let success;
    console.log(form.value);
     

    const user = {
      image: file.name,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      DateOfBirth: form.value.DateOfBirth,
      gender: form.value.gender,
      phone: form.value.phone,
      nationality: form.value.nationality,
      familySituation: form.value.familySituation,
      address: form.value.address,
      experience: form.value.experience,
      hiringDate: form.value.hiringDate,
      department: form.value.department,
      drivingLicense: form.value.drivingLicense,
      
    }



    this.http.post<User>(this._SignuUpUrl, user).subscribe(
      response => {
        
      console.log(response);
      
      const dialogRef = this.dialog.open(SuccessComponent, {
        data: { message: 'You will receive an email once your request is accepted' },
      });
    },
    error => {
      if (error.status === 400) {
        console.log('Email already exists');
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
          data: { message: 'Email already exists' },
        });
        success=false
      }
    }
  );
  return success
  }

  setAuthTimer(expiresIn: number) {
    setTimeout(() => {
      this.logout();

    }, expiresIn * 1000);
  }

  logout() {
    this.token = "";
    this.isAuthenticated = false;
    this.authStatusListener.next(false)
    this.clearAuthData();

    this.router.navigate(["/login"]);
  }
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", this.userId);
    console.log(localStorage.getItem("token"));
    console.log(localStorage.getItem("expiration"))
  }
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }
  
  getSignUpRequests(): Observable<any> {
    
    const url = `${this._BaseUrl}?isEnabled=false`; 
    return this.http.get<User[]>(url);

  }

  countPendingEvents(events: any[]): number {
    return events.filter(event => !event.isEnabled).length;
  }



   getUser(token: string): User {
    const roles = JSON.parse(atob(token.split('.')[1])) as User;
    return roles;

  }

  forgotPassword(email:string){
    return this.http.post("http://localhost:3001/api/users/forgotPassword", { email });

  }
  getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    this.userId = localStorage.getItem("userId");
    this.token = token;
    
    const decodedToken = jwt_decode(token) as { roles: string }; 
    this.roles = decodedToken.roles;

    if (!token || !expirationDate) {
      return null;
    }

    return {
      token: this.token,
      
      roles: this.roles,
      userId: this.userId
    };
  }
getAllUsers(): Observable<User[]> {
   const url = ("http://localhost:3001/api/users/getall");
   return this.http.get<User[]>(url);
}
}


