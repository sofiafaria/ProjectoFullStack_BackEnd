import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import {IUser} from '../../models/User';
import { ValidateService } from 'src/app/services/validate.service';
import { FlashMessagesService } from 'flash-messages-angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: IUser;
  editMode: boolean = false;

  constructor(private authService: AuthService,
              private router: Router,
              private validateService: ValidateService,
              private flashMessageService: FlashMessagesService,
              private userService: UserService) { }

  ngOnInit(): void {
    //load the user on page initialize
    this.authService.getProfile(this.authService.loadUserId()).subscribe((profile: any) =>{
      if(profile.type =='success'){
        this.user = profile.body;
      }else{
        this.flashMessageService.show('Something went wrong', {cssClass: 'alert alert-danger', timeout: 3000});
      }
    },
    (err: any) =>{
      this.flashMessageService.show(err.code, {cssClass: 'alert-danger', timeout: 3000});
    });
  }

  toggleEdit(){
    return this.editMode = !this.editMode;
  }

  onUserSubmit(){
    const myUser = this.user;
    myUser.is_active = true;
    
    //Required Fields
    if(!this.validateService.validateRegister(myUser)){
      this.flashMessageService.show('Please fill in all fields', {cssClass: 'alert alert-danger', timeout: 3000});
      return;
    }

    //Validate email
    if(!this.validateService.validateEmail(myUser.email)){
    this.flashMessageService.show('Invalid Email', {cssClass: 'alert alert-danger', timeout: 3000});
    return;
    }

    this.userService.updateUser(myUser).subscribe((data: any) =>{
      if(data.type =='success'){
        this.flashMessageService.show('User updated', {cssClass: 'alert alert-sucess', timeout: 3000});
        this.toggleEdit();     
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
