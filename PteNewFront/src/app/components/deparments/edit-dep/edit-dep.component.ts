
import { HttpClient } from '@angular/common/http';
import { Component,Inject} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { department } from 'src/app/model/department';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../error-dialog/error-dialog.component';
@Component({
  selector: 'app-edit-dep',
  templateUrl: './edit-dep.component.html',
  styleUrls: ['./edit-dep.component.css'],
  providers: [MatSnackBar]
})
export class EditDepComponent {

  form: FormGroup;
  dataSource: any;


  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditDepComponent> ,
    private http:HttpClient ,
     private snackBar: MatSnackBar,
     public dialog: MatDialog ,
    @Inject(MAT_DIALOG_DATA) public data: { depId: string, dep: department }
     
     ) { }

     ngOnInit() {
      console.log(this.data);
      this.form = this.formBuilder.group({
        name: [this.data.dep.name,Validators.required],
        description: [this.data.dep.description,Validators.required],
        
      });
      
    }

    updateDep(form: FormGroup) {
      if (this.form.valid) {
      const department = {
        name: form.value.name,
        description: form.value.description,
        
      };
      this.http.patch<department>(`http://localhost:3001/api/departments/update/${this.data.depId}`, department)
      .subscribe(
        dep => {
          
          this.snackBar.open('Department updated successfully', 'Close', { duration: 3000 });
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
