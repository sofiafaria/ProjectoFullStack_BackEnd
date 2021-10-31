import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { IQuestion } from '../models/Question';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }



  getQuestions(){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/questions', {headers: headers});
  }

  getQuestion(id: string){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.get(`http://localhost:3000/question/${id}`, {headers: headers});
  }

  createQuestion(question){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/questions', question, {headers: headers}).pipe(catchError(this.handleError));
  }

  deleteQuestion(id: string){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.delete(`http://localhost:3000/question/${id}`, {headers: headers});
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

  validateQuestion(question: IQuestion){
    if((question.question == undefined || question.question=='' )|| (question.title == undefined || question.title =='') ||
       (question.description == undefined ||question.description =='') ||(question.group==undefined || question.group == '') ||
       (question.type == undefined || question.type == '') || (question.level ==undefined || question.level <=0)){
      return false;
    }
    else{
      return true;
    }
  }

  updateQuestion(question){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.put(`http://localhost:3000/question/${question._id}`,question,{headers: headers});      
  }
}

