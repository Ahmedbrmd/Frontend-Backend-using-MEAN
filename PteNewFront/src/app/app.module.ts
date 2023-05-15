import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchPipe } from './pipes/search.pipe';
import { AddroomComponent } from './components/rooms/addroom/addroom.component';
import { EditRoomComponent } from './components/rooms/edit-room/edit-room.component';
import { ManageRoomComponent } from './components/rooms/manage-room/manage-room.component';
import { RoomEventComponent } from './components/rooms/room-event/room-event.component';
import { ManageUserEventComponent } from './components/users/manage-user-event/manage-user-event.component';
import { UserEventComponent } from './components/users/user-event/user-event.component';
import { AddcarComponent } from './components/vehicles/addcar/addcar.component';
import { EditVehicleComponent } from './components/vehicles/edit-vehicle/edit-vehicle.component';
import { EventformComponent } from './components/vehicles/eventform/eventform.component';
import { ManageComponent } from './components/vehicles/manage/manage.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SignUpRequestsComponent } from './components/sign-up-requests/sign-up-requests.component';
import { SignupComponent } from './components/signup/signup.component';
import { UsersComponent } from './components/users/users.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { VerificationcodeComponent } from './components/verificationcode/verificationcode.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


//modules
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//material
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

// import { MaterialModule } from './components/material/material/material.module';
//service
import { AuthService } from './services/auth.service';
import { JwtInterceptor } from './interceptor';
import { DeparmentsComponent } from './components/deparments/deparments.component';
import { AdddepComponent } from './components/deparments/adddep/adddep.component';
import { EditDepComponent } from './components/deparments/edit-dep/edit-dep.component';

import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './components/profile/change-password/change-password.component';
import { UpdateEventComponent } from './components/rooms/update-event/update-event.component';
import { UpdateVEventComponent } from './components/vehicles/update-v-event/update-v-event.component';
import { EditUEventComponent } from './components/users/edit-u-event/edit-u-event.component';
import { SuccessComponent } from './components/success/success.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


// chart
import { NgxChartsModule } from '@swimlane/ngx-charts';





@NgModule({
  declarations: [
    AppComponent,
    SearchPipe,
    AddroomComponent,
    EditRoomComponent,
    ManageRoomComponent,
    SignupComponent,
    RoomEventComponent,
    VehiclesComponent,
    SidebarComponent,
    UsersComponent,
    ErrorDialogComponent,
    SignUpRequestsComponent,
    ConfirmationDialogComponent,
    ChangepasswordComponent,
    NavbarComponent,
    RoomsComponent,
    LoginComponent,
    ManageUserEventComponent,
    UserEventComponent,
    AddcarComponent,
    EditVehicleComponent,
    EventformComponent,
    ManageComponent,
    VerificationcodeComponent,
    DeparmentsComponent,
    AdddepComponent,
    EditDepComponent,
   ProfileComponent,
   EditProfileComponent,
   ChangePasswordComponent,
   UpdateEventComponent,
   UpdateVEventComponent,
   EditUEventComponent,
   SuccessComponent,
   DashboardComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDialogModule,
    NgxChartsModule,
    
    
    
    
    
  ],
  exports:[MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDialogModule,
    
    
    ],
  providers: [AuthService, 
    { 
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true
      }],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
