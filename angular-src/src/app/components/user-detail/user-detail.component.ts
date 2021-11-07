import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime } from 'luxon';
import { IUser } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { ValidateService } from 'src/app/services/validate.service';
import { FlashMessagesService } from 'flash-messages-angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  name: String;
  username: String;
  email: String;
  password: String;
  is_active: boolean;
  is_admin: boolean;
  registration_date: DateTime;

  @Input() currUser: IUser;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private validateService: ValidateService,
              private flashMessageService: FlashMessagesService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
       //load the user detail on page initialize
       const id = this.route.snapshot.paramMap.get('id');
       if(id == '0'){
         this.currUser={
           _id: '',
           name: '',
           username: '',
           email: '',
           password: '',
           is_active: true,
           is_admin: false, 
           registration_date: new Date(),
           gamification: {
            points: 0,
            quiz: []
            }
         }
       }else{
         this.userService.getUser(id).subscribe((user: any) =>{
           if(user.type =='success'){
             this.currUser = user.body;
           }
         });
       }
  }

  isEdit():Boolean{
    const id = this.route.snapshot.paramMap.get('id');
    return !(id == '0');
  }


  onUserSubmit(){

    const user = this.currUser;

    //Required Fields
    if(!this.validateService.validateRegister(user)){
      this.flashMessageService.show('Please fill in all fields', {cssClass: 'alert alert-danger', timeout: 3000});
      return;
    }

    //Validate email
    if(!this.validateService.validateEmail(user.email)){
    this.flashMessageService.show('Invalid Email', {cssClass: 'alert alert-danger', timeout: 3000});
    return;
    }
    if(!this.isEdit()){ //tem que se negar o false para entrar no if  - se não é uma edição cria-se

      //Create User
        this.authService.registerUser(user).subscribe((data:any) => {
          if(data.type =='success'){
            this.flashMessageService.show('User created', {cssClass: 'alert alert-success', timeout: 3000});
            this.router.navigate(['backoffice/users']);
    
          }else{
            this.flashMessageService.show('Something went wrong', {cssClass: 'alert alert-danger', timeout: 3000});
          }
        },
        (err: any) =>{
          this.flashMessageService.show(err.code, {cssClass: 'alert-danger', timeout: 3000});
        }
        );
    }else{
      this.userService.updateUser(user).subscribe((data: any) =>{
        if(data.type =='success'){
          this.flashMessageService.show('User updated', {cssClass: 'alert alert-success', timeout: 3000});
          this.router.navigate(['backoffice/users']);        
        }
        else{
          this.flashMessageService.show('Something went wrong', {cssClass: 'alert alert-danger', timeout: 3000});
        }
      },
      (err: any) =>{
        this.flashMessageService.show(err.code, {cssClass: 'alert-danger', timeout: 3000});
      });
    }
  }
}
