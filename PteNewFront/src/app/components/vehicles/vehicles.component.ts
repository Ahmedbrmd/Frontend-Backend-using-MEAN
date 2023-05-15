import { ManageComponent } from './manage/manage.component';
import { Vehicle } from 'src/app/model/vehicle';
import { Component,ViewChild  } from '@angular/core';
import { VehiclesService } from 'src/app/services/vehicles.service';
import { HttpClient } from '@angular/common/http';
import { CalendarOptions, EventInput  } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FormGroup} from '@angular/forms';
import interactionPlugin from '@fullcalendar/interaction';
import { EventformComponent } from './eventform/eventform.component';
import { MatDialog} from '@angular/material/dialog';
import timeGridPlugin from '@fullcalendar/timegrid';
import { User } from 'src/app/model/user';
import { EditVehicleComponent } from './edit-vehicle/edit-vehicle.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AddcarComponent } from './addcar/addcar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'vehiclesevents',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css'],
  providers: [MatSnackBar]
})
export class VehiclesComponent {
  vehicles : Vehicle[];
  searchText: string = '';
  dataSource: any;
  selectedVehicleId: string;
  showForm: boolean = false;
  form: any = {};
  showCalendar: boolean;
  vehicle : Vehicle;
  applicant:User;
  driver:User;
  user:User;

    
  constructor(
       private vehiclesService : VehiclesService ,
       private http : HttpClient ,
       private dialog: MatDialog ,
       private snackBar: MatSnackBar,
       private authService:AuthService){}
  ngOnInit() {
    this.vehiclesService.getVehicle().subscribe((vehicles) => {
      this.vehicles = vehicles;
    });
      
  }
  
 
  
  
 
    

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    
    dateClick: (info) => {
      const dialogRef = this.dialog.open(EventformComponent, {
        data: { startDate: info.dateStr },
      });
      dialogRef.afterClosed().subscribe(() => {
        console.log('Mini form dialog closed');
      });
    },
    eventClick: (info) => {
      // Get the clicked event's information
      const driver  = info.event.extendedProps['driver'];
      const applicant  = info.event.extendedProps['applicant'];
      const id = info.event.id;
      const title = info.event.title;
      const start = info.event.start;
      const end = info.event.end;
      const isAccepted = info.event.extendedProps['isAccepted'];
      const destination= info.event.extendedProps['destination'];

      
      
  
      // Display the event information using a dialog
      const dialogRef = this.dialog.open(ManageComponent, {
        data: { id,title, start, end, isAccepted,driver,applicant,destination},
      });
      dialogRef.componentInstance.calendar = this.calendarComponent.getApi();
      dialogRef.afterClosed().subscribe(() => {
        console.log('Event info dialog closed');
      });
    },
    
    
  };

  DateClick(info: any) {
    this.vehiclesService.setDateRange(info.dateStr);

    this.openMiniForm();
  }

  
  
 
  @ViewChild('calendar') calendarComponent:FullCalendarComponent ;
  
  
  onVehicleClick(vehicleId: string) {
    this.vehiclesService.setSelectedVehicleId(vehicleId);
    this.selectedVehicleId = vehicleId;
    console.log(this.selectedVehicleId);
    
    this.showCalendar = true;
    const userId = localStorage.getItem("userId");
          console.log('user id:', userId);

  
    this.calendarOptions.events = (info, successCallback, failureCallback) => {
      const start = info.startStr;
      const end = info.endStr;
  
      this.vehiclesService.getVehicleEvents(start, end, this.selectedVehicleId).subscribe(
        ({ acceptedEvents, rejectedEvents , userEvents }: any) => {
          
          const eventInputs: EventInput[] = [
            ...acceptedEvents.map(event => ({
              ...event,
              color: 'green',
              extendedProps: { isAccepted: true }
            })),
            ...rejectedEvents.map(event => ({
              ...event,
              color: 'orange',
              extendedProps: { isAccepted: false }
            })),
            ...userEvents.map(event => ({
              ...event,
              color:'blue',
              extendedProps: { isAccepted: true && event.applicant._id ===userId }
            })),
          ];
          
  
          successCallback(eventInputs);
        },
        (error) => {
          failureCallback(error);
        }
      );
    };
  }
  
  openMiniForm() {
    const dialogRef = this.dialog.open(EventformComponent);
  
    dialogRef.afterClosed().subscribe(() => {
      
      console.log('Mini form dialog closed');
    });
  }
  
  getUserInfo(userId:string){
    this.http.get<User>('http://localhost:3001/api/users/' + userId)
  }

  openupdateForm(vehicleId: string) {
    this.selectedVehicleId = vehicleId;
    const vehicle = this.vehicles.find(v => v._id === vehicleId); // find the vehicle object by its ID
    const dialogRef = this.dialog.open(EditVehicleComponent, { 
      data: { vehicleId: vehicleId, vehicle: vehicle } // pass the vehicleId and vehicle object as data to the dialog
    });
  
    dialogRef.afterClosed().subscribe(() => {
      console.log('Mini form dialog closed');
    });
  }
  
  public searchVehicle(key: string): void {
    
    const results: Vehicle[] = [];
    for (const vehicle of this.vehicles) {
      if (vehicle.model.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || vehicle.registration_number.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || vehicle.type.toLowerCase().indexOf(key.toLowerCase()) !== -1)
   {
        results.push(vehicle); 
      }
    }
    this.vehicles = results;
    if (results.length === 0 || !key) {
      this.vehiclesService.getVehicle().subscribe((vehicles) => {
        this.vehicles = vehicles;
      });
    }
  }

  addVehicle(form : FormGroup){
  
    const vehicle={
          model: form.value.model,
          registration_number: form.value.registration_number,
          type: form.value.type,
    }
    this.http.post<Vehicle>("http://localhost:3001/api/material/vehicle/addVehicle",vehicle).subscribe(newVehicle => {
      this.vehicles.push(newVehicle); 
      this.dataSource.data = this.vehicles; 
      this.snackBar.open('Vehicle added successfully', 'Close', { duration: 3000 });
    });
  }

  deleteVehicle(vehicleid:String){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete this car?',
        confirmButtonText: 'Delete'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
    this.http.delete("http://localhost:3001/api/material/vehicle/deleteVehicle/"+vehicleid).subscribe(() => {
      this.vehicles = this.vehicles.filter(v => v._id !== vehicleid);
      this.snackBar.open('Car deleted successfully', 'Dismiss', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    });}
  });
   
  }

  openAddForm() {
    const dialogRef = this.dialog.open(AddcarComponent);
  
    dialogRef.afterClosed().subscribe(() => {
      
      console.log('Mini form dialog closed');
    });
  }
  checkAdmin(){
    const role = this.authService.getAuthData().roles.includes('admin');
      return role;
  }
}
