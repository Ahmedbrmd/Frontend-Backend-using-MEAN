import { Injectable } from '@angular/core';
import { department } from '../model/department';
import { HttpClient } from '@angular/common/http';
import {  Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  


  constructor(private http: HttpClient) { }



  getDeps ():Observable<any>{
    return this.http.get<department[]>("http://localhost:3001/api/departments/getall");
  }


getDepByid(id:string){
  return this.http.get<department>("http://localhost:3001/api/departments/"+id);
}









}



