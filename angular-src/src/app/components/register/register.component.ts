import { Component, OnInit } from '@angular/core';
import { ValidateService } from 'src/app/services/validate.service';
import { AuthService } from 'src/app/services/auth.service';
import { FlashMessagesComponent, FlashMessagesService } from 'flash-messages-angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  username: String;
  email: String;
  password: String;


  constructor(private validateService : ValidateService,
              private authService: AuthService,
              private flashMessageService: FlashMessagesService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onRegisterSubmit(): void{
  
    const user = {
      name: this.name,
      username: this.username,
      is_admin: false,
      email: this.email,
      password: this.password
    };

    //Required Fields
    if(!this.validateService.validateRegister(user)){
      this.flashMessageService.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
    }

    //Validate email
    if(!this.validateService.validateEmail(user.email)){
      this.flashMessageService.show('Invalid Email', {cssClass: 'alert-danger', timeout: 3000});
    }

    //Register User

      this.authService.registerUser(user).subscribe((data:any) => {
        if(data.type =='success'){
          this.flashMessageService.show('You are now registered and logged in', {cssClass: 'alert-sucess', timeout: 3000});
          this.router.navigate(['login']);
  
        }else{
          this.flashMessageService.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
          this.router.navigate(['register']);
        }
      },
      (err: any) =>{
        this.flashMessageService.show(err.code, {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['register']);
      }
      );
    
  }

}
