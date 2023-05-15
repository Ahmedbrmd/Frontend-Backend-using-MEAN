import { Component, OnInit , ViewChild } from '@angular/core';
import { CalendarOptions, EventInput  } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatDialog} from '@angular/material/dialog';
import { room } from 'src/app/model/room';
import { RoomsService } from 'src/app/services/rooms.service';
import { AddroomComponent } from './addroom/addroom.component';
import { EditRoomComponent } from './edit-room/edit-room.component';
import { ManageRoomComponent } from './manage-room/manage-room.component';
import { RoomEventComponent } from './room-event/room-event.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
  providers: [MatSnackBar]
})
export class RoomsComponent implements OnInit {

  rooms : room[];
  room:room;
  searchText: string = '';
  dataSource: any;
  showForm: boolean = false;
  form: any = {};
  showCalendar: boolean;
  selectedRoomId: string;





  constructor(private roomsService:RoomsService,
             private http : HttpClient , 
             private dialog: MatDialog,
             private snackBar: MatSnackBar,
             private authService: AuthService,
              ){}
  






ngOnInit() {
    this.roomsService.getRooms().subscribe((rooms) => {
         this.rooms=rooms;
    });
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    
    dateClick: (info) => {
      const dialogRef = this.dialog.open(RoomEventComponent, {
        data: { startDate: info.dateStr },
      });
      dialogRef.afterClosed().subscribe(() => {
        console.log('Mini form dialog closed');
      });
    },
    eventClick: (info) => {
      // Get the clicked event's information
      
      const room = info.event.extendedProps['room'];
      const applicant  = info.event.extendedProps['applicant'];
      const id = info.event.id;
      const start = info.event.start;
      const end = info.event.end;
      const isAccepted = info.event.extendedProps['isAccepted'];
      const title = info.event.title;

      
      
  
      // Display the event information using a dialog
      const dialogRef = this.dialog.open(ManageRoomComponent, {
        data: { id,start, end, isAccepted,applicant ,room,title},
      });
      dialogRef.componentInstance.calendar = this.calendarComponent.getApi();
      dialogRef.afterClosed().subscribe(() => {
        console.log('Event info dialog closed');
      });
    },
    
  };

  DateClick(info: any) {
    this.roomsService.setDateRange(info.dateStr);

    this.openMiniForm();
  }

  
  
 
  @ViewChild('calendar') calendarComponent:FullCalendarComponent ;

  openMiniForm() {
    const dialogRef = this.dialog.open(AddroomComponent);
  
    dialogRef.afterClosed().subscribe(() => {
      
      console.log('Mini form dialog closed');
    });
  }

  onRoomClick(roomId: string) {
    this.roomsService.setSelectedRoomId(roomId);
    this.selectedRoomId = roomId;
    console.log(this.selectedRoomId);
    this.showCalendar = true;
    const userId = localStorage.getItem("userId");
          console.log('user id:', userId);
  
    this.calendarOptions.events = (info, successCallback, failureCallback) => {
      const start = info.startStr;
      const end = info.endStr;
  
      this.roomsService.getRoomsEvents(start, end, this.selectedRoomId).subscribe(
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
            ...userEvents.filter(event => ({
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
  public searchRoom(key: string): void {
  
    const results: room[] = [];
    for (const room of this.rooms) {
      if (room.capacity.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || room.label.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || room.location.toLowerCase().indexOf(key.toLowerCase()) !== -1)
   {
        results.push(room); 
      }
    }
    this.rooms = results;
    if (results.length === 0 || !key) {
      this.roomsService.getRooms().subscribe((rooms) => {
        this.rooms = rooms;
      });
    }
  }

  deleteRoom(roomId:String){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete this room?',
        confirmButtonText: 'Delete'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
    this.http.delete("http://localhost:3001/api/material/room/delete/"+roomId).subscribe(() => {
      this.rooms = this.rooms.filter(v => v._id !== roomId);
      this.snackBar.open('Room deleted successfully', 'Dismiss', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    });}
  });
   
  }
  
  openupdateForm(roomId: string) {
    this.selectedRoomId = roomId;
    const room = this.rooms.find(v => v._id === roomId); 
    const dialogRef = this.dialog.open(EditRoomComponent, { 
      data: { roomId: roomId, room: room } 
    });
  
    dialogRef.afterClosed().subscribe(() => {
      console.log('Mini form dialog closed');
    });
  }

  checkAdmin(){
    const role = this.authService.getAuthData().roles.includes('admin');
      return role;
  }
}
