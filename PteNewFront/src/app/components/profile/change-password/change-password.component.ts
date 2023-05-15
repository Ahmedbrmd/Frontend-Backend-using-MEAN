import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from '../../error-dialog/error-dialog.component';
import { SuccessComponent } from '../../success/success.component';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers: [MatSnackBar]

})
export class ChangePasswordComponent implements OnInit{
  FormPw: FormGroup;
  oldPassword:string;
  user:User;

  constructor(
    private authService : AuthService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,


  ) {
    this.FormPw = this.formBuilder.group({
      password: ['', Validators.required],
      newpassword: ['', [Validators.required,Validators.minLength(6)]],
      rpassword:['',[Validators.required,this.matchValues('newpassword')]]

    });
  }

  ngOnInit(){
    const userId = localStorage.getItem("userId");
    this.authService.getUserId(userId).subscribe(
      (user: User) => {
        this.user = user;
        console.log("Retrieved user:", this.user);
      },
      (error) => {
        console.error("Error retrieving user:", error);
      }
    );
  }

  onSubmit() {


    

    


    if (this.FormPw.valid) {
      
    
    
    
    
    
    this.oldPassword=this.FormPw.value.password;
    const newpassword=this.FormPw.value.newpassword;
    const email=this.user.email;
    const userId=this.user._id;
    
    const check = {
      id:userId,
      password:this.oldPassword
    }
    
    const body = {
      email: email,
      password: newpassword,
      id: userId,
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to change your password?',
        confirmButtonText: 'Change'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {



    this.http.post('http://localhost:3001/api/users/checkpass', check).subscribe(
  response => {
    // Password is correct, call the API endpoint to change the password
    this.http.patch('http://localhost:3001/api/users/change-psw/' + userId, body).subscribe(
      () => {
        // Password changed successfully
        console.log('Password updated');
        const dialogRef = this.dialog.open(SuccessComponent, {
          data: { message: 'Password updated successfully' },
        });
      },
      error => {
        console.error(error);
        console.log('Failed to change password:', error.error.message);
      }
    );
  },
  error => {
    console.error(error);
    console.log('Wrong password:', error.error.message);
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      data: { message: 'Wrong password' },
    });
  }
  
);}});
}


  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const input = control.value;
      const isValid = control.root.value[matchTo] === input;
      return isValid ? null : { 'matchValues': true };
    };
  }
}
