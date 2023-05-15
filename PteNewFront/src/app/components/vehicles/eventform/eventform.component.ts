import { Component ,OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { vehicleEvent } from 'src/app/model/vehicleEvent';
import { VehiclesService } from 'src/app/services/vehicles.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/model/user';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../error-dialog/error-dialog.component';
import { SuccessComponent } from '../../success/success.component';


@Component({
  selector: 'eventform',
  templateUrl: './eventform.component.html',
  styleUrls: ['./eventform.component.css']
  
  

})
export class EventformComponent implements OnInit {
  user:User;
  drivers:any[];
  selectedDriver: any;
  
   
  

  constructor(
    private http:HttpClient,
    private vehiclesService : VehiclesService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog ,
    private dialogRef: MatDialogRef<EventformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  eventform: FormGroup;

  ngOnInit() {
    this.eventform = this.formBuilder.group({
      title:[''],
      start:[this.data.startDate],
      starttime:[''],
      end:[''],
      endtime:[''],
      destination:[''],
      driver:[null, Validators.required],
    });
    this.http.post<any>('http://localhost:3001/api/users/filter', {
      drivingLicense: "true",
      paths: 'firstName lastName image -cv -career',
    }).subscribe(
      (response) => {
        this.drivers = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    if (this.eventform.valid) {
      const event = {
        title: this.eventform.value.title,
        start: null,
        end: null,
        vehicle: this.vehiclesService.selectedVehicleId,
        driver: this.eventform.value.driver._id,
        destination: this.eventform.value.destination,
        applicant: localStorage.getItem("userId"),
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
  
      this.http.post<vehicleEvent>("http://localhost:3001/api/material/vehicle/setevent", event)
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
      else {
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
          data: { message: 'Driver already reserved' },
        });
      }
          }
        );
    }
  }
  
  
  
 
  
  
}
