import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { IQuiz } from '../models/Quiz';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }
  
  getQuizzes(){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/quizzes', {headers: headers});
  }

  getQuiz(id: string){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.get(`http://localhost:3000/quiz/${id}`, {headers: headers});
  }

  getQuizByLesson(lessonId: string){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.get(`http://localhost:3000/quiz/lesson/${lessonId}`, {headers: headers});
  }

  createQuiz(quiz){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/quizzes', quiz, {headers: headers}).pipe(catchError(this.handleError));
  }

  deleteQuiz(id: string){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.delete(`http://localhost:3000/quiz/${id}`, {headers: headers});
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

  validateQuiz(quiz: IQuiz){
    if((quiz.name == undefined || quiz.name=='' )|| (quiz.points == undefined || quiz.points <0) || (quiz.level == undefined ||quiz.level <=0)){
      return false;
    }
    else{
      return true;
    }
  }

  updateQuiz(quiz){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.put(`http://localhost:3000/quiz/${quiz._id}`,quiz,{headers: headers});      
  }
}
