import { Injectable } from '@angular/core';
import {HttpClient,  HttpHeaders} from '@angular/common/http';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  authToken: any;

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getUsers(){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/users', {headers: headers});
  }

  getUser(id: string){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.get(`http://localhost:3000/user/${id}`, {headers: headers});
  }

  deleteUser(id: string){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.delete(`http://localhost:3000/user/${id}`, {headers: headers});
  }

  updateUser(user){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.put(`http://localhost:3000/user/${user._id}`,user,{headers: headers});      
  }
}

