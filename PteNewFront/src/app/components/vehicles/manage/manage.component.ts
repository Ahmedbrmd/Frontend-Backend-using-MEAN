import { Component , Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { UpdateVEventComponent } from '../update-v-event/update-v-event.component';
@Component({
  selector: 'manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
  providers: [MatSnackBar]
})
export class ManageComponent implements OnInit {
  private _ConfirmUrl = "http://localhost:3001/api/material/vehicle/acceptEvent/";
  private _DeleteUrl = "http://localhost:3001/api/material/vehicle/deleteEvent/";
  calendar: any;
 

  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                 private dialogRef: MatDialogRef<ManageComponent>,
                 private http: HttpClient,
                 private snackBar: MatSnackBar,
                 private dialog: MatDialog,
                 private authService:AuthService,

  ) {}
  ngOnInit() {
    console.log(this.data);




    
  };
 
checkApplicant() {
  const userId = localStorage.getItem("userId");
  return this.data.applicant._id === userId || this.checkAdmin();
};

  cancel() {
    this.dialogRef.close();
  }
  acceptEvent() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to accept this event?',
        confirmButtonText: 'Accept'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const eventId = this.data.id;
        const body = { isAccepted: true };
        this.http.patch(this._ConfirmUrl+eventId,body).subscribe(() => {
          // Update the isAccepted property of the event in the calendar's events array
          const event = this.calendar.getEventById(eventId);
          if (event) {
            event.setExtendedProp('isAccepted', true);
            event.setProp('backgroundColor', 'green');
          }
          this.snackBar.open('Event accepted successfully', 'Dismiss', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        });
      }
    });
  };
  
  deleteEvent(){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete this event?',
        confirmButtonText: 'Delete'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const eventId = this.data.id;
        this.http.delete(this._DeleteUrl+eventId).subscribe(() => {
          // Remove the event from the calendar's events array
          const event = this.calendar.getEventById(eventId);
          if (event) {
            event.remove();
          }
          this.snackBar.open('Event deleted successfully', 'Dismiss', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        });
      }
    });
  };
  checkAdmin(){
    const role = this.authService.getAuthData().roles.includes('admin');
      return role;
  };
  UpdateVEventComponent

  openMiniForm() {
    const dialogRef = this.dialog.open(UpdateVEventComponent, {
      data: this.data 
    });
  
  }

  checkForUpdate() {
    const userId = localStorage.getItem("userId");
    return (this.data.applicant._id === userId && this.data.isAccepted==false) || this.checkAdmin();
  };







}




