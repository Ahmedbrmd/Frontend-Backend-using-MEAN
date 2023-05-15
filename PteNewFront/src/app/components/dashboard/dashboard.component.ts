import { Component, OnInit } from '@angular/core';
import { VehiclesService } from 'src/app/services/vehicles.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { UserService } from 'src/app/services/users.service';
import { DepartmentService } from 'src/app/services/department.service';
import { department } from 'src/app/model/department';
import { map, forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Color,ScaleType  } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pendingVehicleEventsCount: number = 0;
  totalVehicleEvents: number = 0;
  pendingRoomEventsCount: number = 0;
  totalRoomEvents: number = 0;
  pendingUserEventsCount: number = 0;
  totalUserEvents: number = 0;
  pendingUserRequestsCount: number = 0;

  reservations: any[] = [];
  users: any[] = [];
  AllEvents: number;
  deps : department[];
  
  
  colorScheme: Color = {
    name: 'myColorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FFC107','#f10000', '#2196F3','#f10000' ,'#4CAF50','#f10000']
  };
  
  constructor(
    private vService: VehiclesService,
    private rService: RoomsService,
    private uService: UserService,
    private dService: DepartmentService,
    private aService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.dService.getDeps().subscribe((deps) => {
      this.deps=deps;
 });
    this.fetchVehicleEventsAndCountPending();
    this.fetchRoomEventsAndCountPending();
    this.fetchUserEventsAndCountPending();
    this.fetchUserRequestsAndCountPending();
    this.countAllEvents();
   
  }
  

  countAllEvents(): void {
    forkJoin({
      vehiclesCount: this.vService.getAll().pipe(map(events => events.length)),
      roomsCount: this.rService.getAll().pipe(map(events => events.length)),
      usersCount: this.uService.getAll().pipe(map(events => events.length))
    }).subscribe(
      (counts: { vehiclesCount: number; roomsCount: number; usersCount: number }) => {
        this.AllEvents = counts.vehiclesCount + counts.roomsCount + counts.usersCount;
        console.log("all events:", this.AllEvents);
      },
      (error) => {
        console.error('Error counting events:', error);
      }
    );
  }

  fetchVehicleEventsAndCountPending(): void {
    this.vService.getAll().subscribe(
      (vevents: any[]) => {
        this.pendingVehicleEventsCount = this.vService.countPendingEvents(vevents);
        this.totalVehicleEvents=vevents.length;
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  fetchRoomEventsAndCountPending(): void {
    this.rService.getAll().subscribe(
      (revents: any[]) => {
        this.pendingRoomEventsCount = this.rService.countPendingEvents(revents);
        this.totalRoomEvents=revents.length;
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  fetchUserEventsAndCountPending(): void {
    this.uService.getAll().subscribe(
      (revents: any[]) => {
        this.pendingUserEventsCount = this.uService.countPendingEvents(revents);
        this.totalUserEvents=revents.length;
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  fetchUserRequestsAndCountPending(): void {
    this.aService.getSignUpRequests().subscribe(
      (revents: any[]) => {
        this.pendingUserRequestsCount = this.aService.countPendingEvents(revents);
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  
  
  
  
 

 
}
