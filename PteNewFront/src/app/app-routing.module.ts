import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './auth.guard';
import { VerificationcodeComponent } from './components/verificationcode/verificationcode.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { SignUpRequestsComponent } from './components/sign-up-requests/sign-up-requests.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { UsersComponent } from './components/users/users.component';
import { RoleGuard } from './role.guard';
import { DeparmentsComponent } from './components/deparments/deparments.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';





const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'verificationcode', component: VerificationcodeComponent },
  { path: 'changepassword', component: ChangepasswordComponent },
  { path: 'requests',canActivate: [AuthGuard, RoleGuard],component: SignUpRequestsComponent},
  { path: 'vehicles', canActivate: [AuthGuard], component: VehiclesComponent },
  { path: 'rooms', canActivate: [AuthGuard], component: RoomsComponent },
  { path: 'users', canActivate: [AuthGuard], component: UsersComponent },
  { path: 'departments',canActivate: [AuthGuard, RoleGuard],component: DeparmentsComponent},
  { path: 'profile',canActivate: [AuthGuard], component: ProfileComponent },
  { path: 'dashboard',canActivate: [AuthGuard, RoleGuard], component: DashboardComponent },


  
  
  
  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // {
  //   path: '',
  //   canActivate:[AuthGuard],
  //   component: AppComponent,
  //   children: [{
  //     path: '',
  //     loadChildren: () => import('./app.module').then(m => m.AppModule),
  //   }]
  // }

];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
