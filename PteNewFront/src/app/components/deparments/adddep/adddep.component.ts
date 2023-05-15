import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { department } from 'src/app/model/department';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'app-adddep',
  templateUrl: './adddep.component.html',
  styleUrls: ['./adddep.component.css'],
  providers: [MatSnackBar]
})
export class AdddepComponent implements OnInit{
  
  form: FormGroup;
  constructor(private formBuilder: FormBuilder,
     private dialogRef: MatDialogRef<AdddepComponent> ,
     private http:HttpClient ,
     public dialog: MatDialog ,
     private snackBar: MatSnackBar ) { }
  
  
  
  ngOnInit(){
    this.form = this.formBuilder.group({
      name: ['',Validators.required],
      description: ['',Validators.required],
      
    });
  }

  save() {
    if (this.form.valid) {
      
      const department={
        name: this.form.value.name,
        description: this.form.value.description,
        
      }
      this.http.post<department>("http://localhost:3001/api/departments/add", department).subscribe(
        dep => {
          this.snackBar.open('Department added successfully', 'Close', { duration: 3000 });
          location.reload();
        },
        error => {
          if (error.status === 400) {
            
            const dialogRef = this.dialog.open(ErrorDialogComponent, {
              data: { message: 'Department already exists' },
            });
          }
        }
      );
    }
  }
  

  cancel() {
    this.dialogRef.close();
  }
}
