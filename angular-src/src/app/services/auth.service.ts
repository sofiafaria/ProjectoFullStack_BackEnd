import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError, retry, map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;
  id: string;
  admin: boolean;

  constructor(private http: HttpClient,
              private jwtHelperService: JwtHelperService) { }

  authenticateUser(user){
    let headers = new HttpHeaders();
    headers =headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/auth/authenticate', user, {headers: headers}).pipe(catchError(this.handleError));
  }

  getProfile(id: string){
    let headers = new HttpHeaders();
    const token =this.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.get(`http://localhost:3000/user/${id}`, {headers: headers}).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse){
    if(error.status ===0){
      //A client-side or network error occurred.
      console.log('An error occurred: ', error.error);
    }
    else{
      //The backend returned an unsuccessful response code.
      //The response may contain clues of what went wrong
      console.log(error.error);
    }
    return throwError(error.error);

  }

  isAdmin(): boolean{
    this.getProfile(this.loadUserId()).subscribe((user: any) =>{
      if(user.type == 'success'){
       this.admin = user.body.is_admin;
      }
      else{
        this.admin = false;
      }
    });
    return this.admin;
  }

  isExpired(){
    this.loadToken();
    return this.jwtHelperService.isTokenExpired(this.authToken);
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
    return token;
  }

  loadUserId():string{
    const localUser = localStorage.getItem('user');
    if(!localUser){
      return '0';
    }
    this.user = JSON.parse(localUser);
    const id: string = this.user._id;
    return id;
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  registerUser(user){
    let headers = new HttpHeaders();
    headers =headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/auth/register', user, {headers: headers}).pipe(catchError(this.handleError));
  }
  
  storeUserData(token: string, user: any){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }


}

