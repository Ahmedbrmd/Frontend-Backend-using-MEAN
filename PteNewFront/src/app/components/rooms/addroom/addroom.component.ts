import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Vehicle } from 'src/app/model/vehicle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'addroom',
  templateUrl: './addroom.component.html',
  styleUrls: ['./addroom.component.css'],
  providers: [MatSnackBar]

})
export class AddroomComponent implements OnInit{

  form: FormGroup;
  dataSource: any;

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddroomComponent> ,private http:HttpClient ,  private snackBar: MatSnackBar ) { }
  ngOnInit(){
    this.form = this.formBuilder.group({
      capacity: ['',[Validators.required,this.capacityValidator]],
      label: ['',Validators.required],
      location: ['',Validators.required],
    });
  }


  save() {
    if (this.form.valid) {
      
      const room={
        capacity: this.form.value.capacity,
        label: this.form.value.label,
        location: this.form.value.location,
      }
      this.http.post<Vehicle>("http://localhost:3001/api/material/room/add", room).subscribe(
        newVehicle => {
          this.snackBar.open('Vehicle added successfully', 'Close', { duration: 3000 });
          location.reload();
        },
        error => {
          if (error.status === 400) {
            console.log('registration number already exists');
            this.snackBar.open('Registration number already exists', 'Close', { duration: 3000 });
          }
        }
      );
    }
  }
  

  cancel() {
    this.dialogRef.close();
  }

  capacityValidator(control: FormControl): { [s: string]: boolean } | null {
    const pattern = /^\d+$/;
    if (control.value && !pattern.test(control.value)) {
      return { 'Enter a valid capacity number': true };
    }
    return null;
  }

}
