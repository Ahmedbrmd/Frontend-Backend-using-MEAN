import { Component ,OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from '../../error-dialog/error-dialog.component';
import { SuccessComponent } from '../../success/success.component';
@Component({
  selector: 'app-edit-u-event',
  templateUrl: './edit-u-event.component.html',
  styleUrls: ['./edit-u-event.component.css']
  
})
export class EditUEventComponent implements OnInit{
  eventform: FormGroup;
  

private _UpdateUrl="http://localhost:3001/api/users/updateUserEvent/";

  constructor( 
    
    private http:HttpClient,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditUEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,   
    private dialog: MatDialog

){}

  ngOnInit(){
    
    this.eventform = this.formBuilder.group({
      title:[this.data.title],
      start:[this.data.start],
      starttime:[''],
      end:[this.data.end],
      endtime:[''],
      job:[this.data.job],
      address:[this.data.address]
      });
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    
    
    
    if (this.eventform.valid ) {
      const event = {
        title: this.eventform.value.title,
        start: null,
        end:null,
        job:this.eventform.value.job,
        address:this.eventform.value.address,
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

      this.http.patch(this._UpdateUrl+eventId,event).subscribe((response) => {
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
       
      });
     }
    });
    }
    
  
  }
   
}
