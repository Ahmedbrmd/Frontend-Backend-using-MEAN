import { Component, OnInit , ViewChild } from '@angular/core';
import { department } from 'src/app/model/department';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatDialog} from '@angular/material/dialog';
import { DepartmentService } from 'src/app/services/department.service';
import { AdddepComponent } from './adddep/adddep.component';
import { EditDepComponent } from './edit-dep/edit-dep.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
@Component({
  selector: 'app-deparments',
  templateUrl: './deparments.component.html',
  styleUrls: ['./deparments.component.css'],
  providers: [MatSnackBar]
})
export class DeparmentsComponent implements OnInit{
  deps : department[];
  dep:department;
  dataSource: any;
  selectedDepId: string;

  constructor(private depService:DepartmentService,
    private http : HttpClient , 
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    
     ){}

     ngOnInit() {
      this.depService.getDeps().subscribe((deps) => {
           this.deps=deps;
      });
    }

    deleteRoom(depId:String){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: {
          title: 'Confirmation',
          message: 'Are you sure you want to delete this car?',
          confirmButtonText: 'Delete'
        }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
      this.http.delete("http://localhost:3001/api/departments/delete/"+depId).subscribe(() => {
        this.deps = this.deps.filter(d => d._id !== depId);
        this.snackBar.open('Deparment deleted successfully', 'Dismiss', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      });}
    });
     
    }
    
    openupdateForm(depId: string) {
      this.selectedDepId = depId;
      const dep = this.deps.find(v => v._id === depId); // find the vehicle object by its ID
      const dialogRef = this.dialog.open(EditDepComponent, { 
        data: { depId: depId, dep: dep } // pass the vehicleId and vehicle object as data to the dialog
      });
    
      dialogRef.afterClosed().subscribe(() => {
        console.log('Mini form dialog closed');
      });
    }

    openMiniForm() {
      const dialogRef = this.dialog.open(AdddepComponent);
    
      dialogRef.afterClosed().subscribe(() => {
        
        console.log('Mini form dialog closed');
      });
    }
}
