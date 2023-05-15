import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog} from '@angular/material/dialog';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { department } from 'src/app/model/department';
import { DepartmentService } from 'src/app/services/department.service';
import { Data } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  img: string;
  deps : department[];
  firstName:string;
  lastName:string;
  DateOfBirth:Date;
  phone:number;
  address:string;
  nationality:string;
  email:string;
  
  title:string;
  hiringDate:Date;
  experience:number;
  department:string;


  constructor(private authService: AuthService,
       private dialog: MatDialog,
       private depService:DepartmentService,
       ) {}

  ngOnInit() {
    const userId = localStorage.getItem("userId");

    if (userId) {
      this.authService.getUserId(userId).subscribe(
        (user: User) => {
          this.user = user;
          this.img = 'http://localhost:3001/images/' + this.user.image;
          this.firstName = user.firstName;
          this.lastName = user.lastName;
          this.DateOfBirth = user.DateOfBirth;
          this.phone = user.phone;
          this.address = user.address;
          this.nationality = user.nationality;
          this.email = user.email;
          this.title = user.title;
          this.hiringDate = user.hiringDate;
          this.experience = user.experience;
          this.department = this.getDepartmentName(user.department);
          console.log("Retrieved user:", this.user);
        },
        (error) => {
          console.error("Error retrieving user:", error);
        }
      );
    } else {
      console.log("userId is not available");
    }

    this.depService.getDeps().subscribe((deps) => {
      this.deps=deps;
 });

  }

  getDepartmentName(departmentId: string): string {
    const department = this.deps.find(dep => dep._id === departmentId);
    return department ? department.name.toString() : '';
  }

  openupdateForm() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      data: {
        userId: localStorage.getItem("userId"),
        user: this.user
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Mini form dialog closed');
    });
  }

  openChangePw() {
    
    const dialogRef = this.dialog.open(ChangePasswordComponent, { 
      
    });
  
    dialogRef.afterClosed().subscribe(() => {
      console.log('Mini form dialog closed');
    });
  }


}
