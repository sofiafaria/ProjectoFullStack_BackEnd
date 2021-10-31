import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FlashMessagesService } from 'flash-messages-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(private authService: AuthService,
              private flashMessageService: FlashMessagesService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onLoginSubmit(){
    const user = {
      username: this.username,
      password: this.password
    }

    this.authService.authenticateUser(user).subscribe( (data:any) =>{
      if(data.type =='success'){
        this.authService.storeUserData(data.body.token, data.body.user);
        this.flashMessageService.show(data.code, {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['lessons']);
        
      }else{
          this.flashMessageService.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
          this.router.navigate(['login']);
      };
    },
    (err: any) =>{
      this.flashMessageService.show(err.code, {cssClass: 'alert-danger', timeout: 3000});
      this.router.navigate(['login']);
    } );
  }

}
