import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {catchError, retry, map} from 'rxjs/operators';
import { ILesson } from '../models/Lesson';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getLessons(){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/lessons', {headers: headers});
  }

  getLessonByFilter(filter: string){
    return this.getLessons().subscribe((lessons: any) => {
        return lessons.find((lesson) => {
          return lesson.name == filter
        });
      });
  }

  getLesson(id: string){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.get(`http://localhost:3000/lesson/${id}`, {headers: headers});
  }

  createLesson(lesson: ILesson){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/lessons', lesson, {headers: headers}).pipe(catchError(this.handleError));
  }

  deleteLesson(id: string){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.delete(`http://localhost:3000/lesson/${id}`, {headers: headers});
  }

  updateLesson(lesson){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
    headers =headers.append('Content-Type', 'application/json');
    return this.http.put(`http://localhost:3000/lesson/${lesson._id}`,lesson,{headers: headers});      
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

  validateLesson(lesson: ILesson){
    if((lesson.name == undefined || lesson.name=='' )|| (lesson.group == undefined || lesson.group =='') || (lesson.description == undefined || lesson.description =='') || (lesson.level == undefined ||lesson.level <=0)){
      return false;
    }
    else{
      return true;
    }
  }

  uploadLessonFile(lessonId: string, file: File){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers =headers.append('Authorization', token);
   // headers =headers.append('Content-Type', 'multipart/form-data'); //tive que tirar estava a dar erro...
    headers = headers.append('Accept', 'application/json');
    let formData = new FormData();
    formData.append('name', `${lessonId}_${file.name}`);
    formData.append('file', file, `${lessonId}_${file.name}`);
    return this.http.post(`http://localhost:3000/lesson/${lessonId}/uploadFile`, formData, {headers: headers}).pipe(catchError(this.handleError));
  }

  deleteLessonFile(lessonId: string, filepath:string){
    let headers = new HttpHeaders();
    const token =this.authService.loadToken();
    headers = headers.append('Authorization', token);
    headers = headers.append('Content-Type', 'application/json');
    let splitFileArray = filepath.split('/');
    let fileId: string = splitFileArray[splitFileArray.length-1];
    return this.http.delete(`http://localhost:3000/lesson/${lessonId}/deleteFile/${fileId}`, {headers: headers});
  }
}