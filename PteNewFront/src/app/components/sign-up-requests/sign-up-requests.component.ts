
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessComponent } from '../success/success.component';
@Component({
  selector: 'sign-up-requests',
  templateUrl: './sign-up-requests.component.html',
  styleUrls: ['./sign-up-requests.component.css'],
  providers: [MatSnackBar]
})


 
export class SignUpRequestsComponent implements OnInit{
users : User[];
deleteError: string;
  deleteSuccess: string;
  private _DeleteUrl = "http://localhost:3001/api/users/delete/";
  private _ConfirmUrl= "http://localhost:3001/api/users/confirm-signup/";
  user: User;
  file;

constructor(private snackBar: MatSnackBar, private AuthService: AuthService , private http : HttpClient , private dialog: MatDialog){}
ngOnInit() {
  this.AuthService.getSignUpRequests().subscribe((users) => {
    this.users = users;
  });
  
}
deleteUser(userId: string) {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '350px',
    data: {
      title: 'Confirmation',
      message: 'Are you sure you want to delete this user?',
      confirmButtonText: 'Delete'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.http.delete(this._DeleteUrl + userId).subscribe(() => {
        this.users = this.users.filter(user => user._id !== userId);
        
        
      });
      const dialogRef = this.dialog.open(SuccessComponent, {
        data: { message: 'User deleted successfully' },
      });
    }
  });
}

confirmSignUp(userId:string){
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '350px',
    data: {
      title: 'Confirmation',
      message: 'Are you sure you want to confirm this user\'s signup?',
      confirmButtonText: 'Confirm'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.http.post(this._ConfirmUrl+userId, {}).subscribe(() => {
        this.users = this.users.filter(user => user._id !== userId);
        
        
      });
      const dialogRef = this.dialog.open(SuccessComponent, {
        data: { message: 'User accepted successfully' },
      });
    }
  });
}




}

