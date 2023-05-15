import { HttpClient } from '@angular/common/http';
import { Component,Inject} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { room } from 'src/app/model/room';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.css'],
  providers: [MatSnackBar]
})
export class EditRoomComponent {

  rooms : room[];
  dataSource: any;
  form: FormGroup;
  room : room;


  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditRoomComponent> ,
    private http:HttpClient ,
     private snackBar: MatSnackBar,
     @Inject(MAT_DIALOG_DATA) public data: { roomId: string, room: room }
     
     ) { }

     ngOnInit() {
      this.form = this.formBuilder.group({
        capacity: [this.data.room.capacity,[Validators.required,this.capacityValidator]],
        label: [this.data.room.label,Validators.required],
        location: [this.data.room.location,Validators.required],
      });
      
    }
  
    updateRoom(form: FormGroup) {
      if (this.form.valid) {
      const room = {
        capacity: form.value.capacity,
        label: form.value.label,
        location: form.value.location,
      };
      this.http.patch<room>(`http://localhost:3001/api/material/room/update/${this.data.roomId}`, room)
      .subscribe(
        newVehicle => {
          location.reload();
          this.snackBar.open('Room updated successfully', 'Close', { duration: 3000 });
        },
        
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
