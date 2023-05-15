import { Component} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user: User;
  img: string;
  firstName:string;
  lastName:string;


    constructor(private authService : AuthService) {
      
    }

    ngOnInit(){
      const userId = localStorage.getItem("userId");

      if (userId) {
        this.authService.getUserId(userId).subscribe(
          (user: User) => {
            this.user = user;
            this.img = 'http://localhost:3001/images/' + this.user.image;
            this.firstName = this.user.firstName,
            this.lastName = this.user.lastName
            console.log("Retrieved user:", this.user);
          },
          (error) => {
            console.error("Error retrieving user:", error);
          }
        );
      } else {
        console.log("userId is not available");
      }
    }

    logout(){
        this.authService.logout();
    }
    toggleDropdown() {
      var dropdownContent = document.getElementById("Dropdown");
      if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
      } else {
        dropdownContent.style.display = "block";
      }
    }
}
