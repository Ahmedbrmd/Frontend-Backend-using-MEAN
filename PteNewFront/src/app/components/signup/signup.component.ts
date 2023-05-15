

import {  Observable, throwError } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { department } from './../../model/department';
import { DepartmentService } from 'src/app/services/department.service';



@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [MatSnackBar]

})
export class SignupComponent implements OnInit {
  
  success=false;
  registerForm : FormGroup;
  checked = false;
  file : File=null;
  user : User;
  drivingLicense: any;
  deps:department[];
  departmentControl: FormControl;
  constructor(private AuthService: AuthService,
              private depService : DepartmentService,
               private fb: FormBuilder , 
               private UploadService : UploadService,
               ) { }
 
 
 
  ngOnInit(): void {
    this.departmentControl = new FormControl('', Validators.required);
    this.depService.getDeps().subscribe((deps) => {
      this.deps=deps;
 });

    this.registerForm= this.fb.group({
    image: ['',Validators.required],
    firstName: ['',Validators.required],
    lastName: ['',Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['',[Validators.required, Validators.minLength(6)]] ,
    confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    phone: ['' , [Validators.required, Validators.maxLength(8), Validators.minLength(8) , Validators.pattern('^[0-9]*$')]],
    DateOfBirth: ['',Validators.required] ,
    gender : ['',Validators.required],
    nationality:['',Validators.required],
    familySituation:['',Validators.required],
    address:['',Validators.required],
    experience:['',Validators.required],
    hiringDate:['',Validators.required],
    department:this.departmentControl,
    drivingLicense:['true',Validators.required],
    



    })
   }

   matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const input = control.value;
      const isValid = control.root.value[matchTo] === input;
      return isValid ? null : { 'matchValues': true };
    };
  }
  

  
   
  
  onFileSelected(event) {
  console.log(event.target.files[0])
  this.file = event.target.files[0]}

  private handleError(error: any): Observable<any> {
    // Handle error here
    console.error('An error occurred:', error);
    return throwError(error);
  }

  
  onSubmit(image){
    
    
    
     if (this.file && this.registerForm.valid) {
        this.UploadService.uploadFormData(this.file).subscribe();
        const image : File = this.file;
      
       this.success=this.AuthService.signup(this.registerForm , image);
      
   }}
  
  
  }