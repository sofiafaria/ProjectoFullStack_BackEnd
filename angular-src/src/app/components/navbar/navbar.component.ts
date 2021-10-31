import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'flash-messages-angular';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  admin: boolean;

  constructor(private authService: AuthService,
            private router: Router,
            private flashMessageService: FlashMessagesService) { }

  ngOnInit(): void {
    this.isAdmin();
  }

  onLogoutClick(){
    this.authService.logout();
    this.flashMessageService.show('Logout successful', {cssClass: 'alert-success', timeout: 3000});
    this.router.navigate(['login']);
    return false;
  }

  isLoggedIn(): boolean{
    //retorna o oposto porque o authService está a validar se o token está expirado
    return !this.authService.isExpired();
  }

  isAdmin(){
    if (!this.isLoggedIn()){
      this.admin= false;
    }
    if(this.authService.isAdmin()){
      this.admin= true;
    }else{
      this.admin= false;
    };
  }

}
