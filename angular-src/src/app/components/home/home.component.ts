import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  
  }

  isLoggedIn(): boolean{
    //retorna o oposto porque o authService está a validar se o token está expirado
    return !this.authService.isExpired();
  }

}
