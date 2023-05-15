
import { Component ,OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { roomEvent } from 'src/app/model/roomEvent';
import { RoomsService } from 'src/app/services/rooms.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../error-dialog/error-dialog.component';
import { SuccessComponent } from '../../success/success.component';

@Component({
  selector: 'room-event',
  templateUrl: './room-event.component.html',
  styleUrls: ['./room-event.component.css'],
  providers: [MatSnackBar]
})
export class RoomEventComponent implements OnInit{

  eventform: FormGroup;

  
  
  constructor( private roomsService :RoomsService,
               private http:HttpClient,
               private formBuilder: FormBuilder,
               private dialogRef: MatDialogRef<RoomEventComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private snackBar: MatSnackBar,
               public dialog: MatDialog ,

       
    ){}


  ngOnInit(){
    this.eventform = this.formBuilder.group({
      title:[''],
      start:[this.data.startDate],
      starttime:[''],
      end:[''],
      endtime:[''],
      });
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    if (this.eventform.valid) {
      const event = {
        title: this.eventform.value.title,
        start:null,
        end: null,
        applicant: localStorage.getItem("userId"),
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
    
  
      this.http.post<roomEvent>("http://localhost:3001/api/material/room/setevent", event)
        .subscribe(
          (response) => {
            console.log('Event created successfully', response);
            const dialogRef = this.dialog.open(SuccessComponent, {
              data: { message: 'Event created successfully' },
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
  }
  

}
