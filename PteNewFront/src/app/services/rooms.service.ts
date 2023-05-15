import { Injectable } from '@angular/core';
import { room } from '../model/room';
import { EventInput } from '@fullcalendar/core';
import { map, Observable, OperatorFunction } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  dateStart: Date;
  selectedRoomId: string;
  
  constructor(private http: HttpClient) { }


  getRooms ():Observable<any>{
    return this.http.get<room[]>("http://localhost:3001/api/material/room/getRooms");
  }
  setDateRange(dateStart: Date) {
    this.dateStart = dateStart;
    
  }
  setSelectedRoomId(roomId: string) {
    this.selectedRoomId = roomId;
  }
  
  getRoomsEvents(start: string, end: string, roomId: string) {
    const startISO = new Date(start).toISOString().slice(0, 16);
    const endISO = new Date(end).toISOString().slice(0, 16);
    return this.http.get(`http://localhost:3001/api/material/room/events?start=${startISO}&end=${endISO}&room=${roomId}`)
      .pipe(
        map((events: any[]) => {
          const acceptedEvents: EventInput[] = [];
          const rejectedEvents: EventInput[] = [];
          const userEvents: EventInput[] = [];
  
          events.forEach(event => {
            const eventInput: EventInput = {
              room: event.room,
              applicant: event.applicant,
              id: event._id,
              start: event.start,
              end: event.end,
              title: event.title,
              isAccepted : event.isAccepted,
            };
  
            const userId = localStorage.getItem("userId");
  
            if (event.isAccepted && event.applicant._id === userId) {
              userEvents.push(eventInput);
            } else if (event.isAccepted) {
              acceptedEvents.push(eventInput);
            } else {
              rejectedEvents.push(eventInput);
            }
          });
  
          return { acceptedEvents, rejectedEvents, userEvents };
        }) as OperatorFunction<Object, { acceptedEvents: EventInput[]; rejectedEvents: EventInput[]; userEvents: EventInput[] }> // cast to the correct type
      );
  }
  

  getAll(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3001/api/material/room/getAll');
  }

  countPendingEvents(events: any[]): number {
    return events.filter(event => !event.isAccepted).length;
  }

}
