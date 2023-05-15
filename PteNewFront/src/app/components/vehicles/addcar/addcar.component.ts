import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Vehicle } from 'src/app/model/vehicle';
import { VehiclesService } from 'src/app/services/vehicles.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'addcar',
  templateUrl: './addcar.component.html',
  styleUrls: ['./addcar.component.css'],
  providers: [MatSnackBar]


})
export class AddcarComponent implements OnInit{
  



  vehicles : Vehicle[];


  form: FormGroup;
  dataSource: any;

  

  constructor(private formBuilder: FormBuilder,
     private dialogRef: MatDialogRef<AddcarComponent> ,
     private http:HttpClient ,
      public dialog: MatDialog ,
      private snackBar: MatSnackBar ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      model: ['',Validators.required],
      registration_number: ['',[Validators.required,this.registrationNumberValidator]],
      type: ['',Validators.required],
    });
  }

  save() {
    if (this.form.valid) {
      
      const vehicle={
        model: this.form.value.model,
        registration_number: this.form.value.registration_number,
        type: this.form.value.type,
      }
      this.http.post<Vehicle>("http://localhost:3001/api/material/vehicle/addVehicle", vehicle).subscribe(
        newVehicle => {
          this.snackBar.open('Vehicle added successfully', 'Close', { duration: 3000 });
          location.reload();
        },
        error => {
          if (error.status === 400) {
            console.log('registration number already exists');
            const dialogRef = this.dialog.open(ErrorDialogComponent, {
              data: { message: 'Registration number already exists' },
            });
          }
        }
      );
    }
  }
  

  cancel() {
    this.dialogRef.close();
  }
  registrationNumberValidator(control: FormControl): { [s: string]: boolean } | null {
    
    const pattern = /^[1-9]\d{0,2} \d{1,4}$/;
    if (control.value && !pattern.test(control.value)) {
      
      return { 'invalidRegistrationNumber': true };
    }
    
    return null;
  }
  
}
