import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { FlashMessagesService } from 'flash-messages-angular';
@Component({
  selector: 'app-user-backoffice',
  templateUrl: './user-backoffice.component.html',
  styleUrls: ['./user-backoffice.component.css']
})
export class UserBackofficeComponent implements OnInit {

  users: IUser[];
  user: IUser;


  constructor(private userService: UserService,
              private flashMessageService: FlashMessagesService) { }

  ngOnInit(): void {
    this.showUsers();

  }

  showUsers(){
    this.userService.getUsers().subscribe((users: any) =>{
      if(users.type =='success'){
        this.users = users.body;
      }
    })
  }

  onDelete(id){
    if(confirm('Are you sure you want to delete this user')){
      this.userService.deleteUser(id)
        .subscribe(() => this.users.filter(x => x._id!==id));
    }
    this.flashMessageService.show('User deleted', {cssClass: 'alert alert-success', timeout: 3000});
    this.showUsers(); 
  }

}
