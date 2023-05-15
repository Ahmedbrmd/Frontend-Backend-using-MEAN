import { Injectable } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import {map, Observable, OperatorFunction} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  dateStart: Date;
  selecteUserId: string;
  constructor(private http: HttpClient) { }
user:User;

  getUsers():Observable<any>{

    return this.http.get<User[]>("http://localhost:3001/api/users/getall");


 }


  setDateRange(dateStart: Date) {
    this.dateStart = dateStart;
    
  }
  setSelectedUserId(userId: string) {
    this.selecteUserId = userId;
  }
  
  getUserEvents(start: string, end: string , userId: string) {
    const startISO = new Date(start).toISOString().slice(0, 16); 
    const endISO = new Date(end).toISOString().slice(0, 16); 
    return this.http.get(`http://localhost:3001/api/users/events?start=${startISO}&end=${endISO}&engineer=${userId}`)
      .pipe(
        map((events: any[]) => {
          const acceptedEvents: EventInput[] = [];
          const rejectedEvents: EventInput[] = [];
          const userEvents : EventInput[] = [];
  
          events.forEach(event => {
            const eventInput: EventInput = {
              title:event.title,
              applicant:event.applicant,
              id:event._id,
              start: event.start,
              end: event.end,
              engineer: event.engineer,
              job: event.job,
              address: event.address
              
            };
            const res = localStorage.getItem("userId");


            console.log(eventInput)
            
            if (event.isAccepted && event.applicant._id === res) {
              userEvents.push(eventInput);
            } else if (event.isAccepted) {
              acceptedEvents.push(eventInput);
            } else {
              rejectedEvents.push(eventInput);
            }
          });
  
          return { acceptedEvents, rejectedEvents , userEvents };
        }) as OperatorFunction<Object, { acceptedEvents: EventInput[]; rejectedEvents: EventInput[];userEvents : EventInput[] }> 
      );
      
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3001/api/users/getAllevents');
  }

  countPendingEvents(events: any[]): number {
    return events.filter(event => !event.isAccepted).length;
  }
}
