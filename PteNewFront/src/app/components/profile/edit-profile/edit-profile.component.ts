import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { department } from 'src/app/model/department';
import { User } from 'src/app/model/user';
import { DepartmentService } from 'src/app/services/department.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  providers: [MatSnackBar]
})
export class EditProfileComponent {

  updateForm: FormGroup;
  dataSource: any;
  departmentControl: FormControl;
  deps: department[];
  file: any;
  user: User;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private depService: DepartmentService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string, user: User }

  ) { }

  ngOnInit() {
    
console.log("data=",this.data);
    const userId = localStorage.getItem("userId");

    

          this.updateForm = this.formBuilder.group({
            firstName: [this.data.user.firstName, Validators.required],
            lastName: [this.data.user.lastName, Validators.required],
            phone: [
              this.data.user.phone,
              [Validators.required, Validators.maxLength(8), Validators.minLength(8), Validators.pattern('^[0-9]*$')]
            ],
            DateOfBirth: [this.data.user.DateOfBirth, Validators.required],
            nationality: [this.data.user.nationality, Validators.required],
            familySituation: [this.data.user.familySituation, Validators.required],
            address: [this.data.user.address, Validators.required],
            experience: [this.data.user.experience, Validators.required],
            hiringDate: [this.data.user.hiringDate, Validators.required],
            department: [this.getdeps(), Validators.required],
            drivingLicense: [this.data.user.drivingLicense, Validators.required],
          });

          
  }
  getdeps(){
    this.departmentControl = new FormControl('');
    this.depService.getDeps().subscribe((deps) => {
      this.deps = deps;
    });
  }


  onFileSelected(event) {
    console.log(event.target.files[0])
    this.file = event.target.files[0]
  }

  private handleError(error: any): Observable<any> {
    // Handle error here
    console.error('An error occurred:', error);
    return throwError(error);
  }

  updateProfile(form: FormGroup) {
    const userId = this.data.user._id;

    if (this.updateForm.valid){
    const user = {

      firstName: form.value.firstName,
      lastName: form.value.lastName,
      DateOfBirth: form.value.DateOfBirth,
      phone: form.value.phone,
      nationality: form.value.nationality,
      familySituation: form.value.familySituation,
      address: form.value.address,
      experience: form.value.experience,
      hiringDate: form.value.hiringDate,
      department: form.value.department,
      drivingLicense: form.value.drivingLicense,

    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to update your profile?',
        confirmButtonText: 'Update'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
    
    this.http.patch(`http://localhost:3001/api/users/update/${userId}`, user).subscribe(
      (updatedUser: any) => {
        this.user = updatedUser;
        console.log('Updated user:', this.user);
        location.reload();
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );}
  });}
  }

}
