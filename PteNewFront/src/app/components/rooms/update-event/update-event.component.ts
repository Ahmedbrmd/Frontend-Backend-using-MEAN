import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoomsService } from 'src/app/services/rooms.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from '../../error-dialog/error-dialog.component';
import { SuccessComponent } from '../../success/success.component';
@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.css'],
  providers: [MatSnackBar]
})
export class UpdateEventComponent implements OnInit {

  eventform: FormGroup;


  private _UpdateUrl = "http://localhost:3001/api/material/room/updateRoomEvent/";
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                 private dialogRef: MatDialogRef<UpdateEventComponent>,
                 private http: HttpClient,
                 private snackBar: MatSnackBar,
                 private formBuilder: FormBuilder,
                 private roomsService : RoomsService,
                 private dialog: MatDialog


  ) {}
  ngOnInit(){

console.log(this.data);



this.eventform = this.formBuilder.group({
      title: [this.data.title], 
      start: [this.data.start],
      end: [this.data.end],
      starttime: [''],
      endtime: [this.data.end],
    });
  }
  

  

  updateEvent(){
  

      
    if (this.eventform.valid){
      
      
    const event = {
      title: this.eventform.value.title,
      start:null,
      end: null,
      room: this.roomsService.selectedRoomId,
    };

    

    if (this.eventform.value.starttime) {
      const startDate = moment(this.eventform.value.start).startOf('day');
      const startTime = moment(this.eventform.value.starttime, 'HH:mm');
      const startDateTime = startDate.add(startTime.get('hours'), 'hours').add(startTime.get('minutes'), 'minutes');

      event.start = startDateTime.toISOString();
    }

    if (this.eventform.value.endtime) {
      const endDate = moment(this.eventform.value.end).startOf('day');
      const endTime = moment(this.eventform.value.endtime, 'HH:mm');
      const endDateTime = endDate.add(endTime.get('hours'), 'hours').add(endTime.get('minutes'), 'minutes');

      event.end = endDateTime.toISOString();
    }
    const eventId = this.data.id;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want update your reservation?',
        confirmButtonText: 'Update'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

    this.http.patch(this._UpdateUrl+eventId,event).subscribe(
      (response) => {
        console.log('Event updated successfully', response);
        const dialogRef = this.dialog.open(SuccessComponent, {
          data: { message: 'Event updated successfully' },
        });
      },
      (error) => {
        console.log('Error creating event', error);
        if (error.status === 500) {
          const dialogRef = this.dialog.open(ErrorDialogComponent, {
            data: { message: 'Dates already reserved' },
          });
        }
      }
    );
  }
  });
  }}
  
  
  cancel() {
    this.dialogRef.close();
  }



}
