import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LessonComponent } from './components/lesson/lesson.component';
import { ProfileComponent } from './components/profile/profile.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { BackofficeComponent } from './components/backoffice/backoffice.component';
import { LessonBackofficeComponent } from './components/lesson-backoffice/lesson-backoffice.component';
import { LessonDetailComponent } from './components/lesson-detail/lesson-detail.component';
import { DeleteConfirmationDialogComponent } from './components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { UserBackofficeComponent } from './components/user-backoffice/user-backoffice.component';
import { LessonBackofficeDetailComponent } from './components/lesson-backoffice-detail/lesson-backoffice-detail.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { QuizBackofficeComponent } from './components/quiz-backoffice/quiz-backoffice.component';
import { QuizBackofficeDetailComponent } from './components/quiz-backoffice-detail/quiz-backoffice-detail.component';
import { QuestionBackofficeComponent } from './components/question-backoffice/question-backoffice.component';
import { QuestionBackofficeDetailComponent } from './components/question-backoffice-detail/question-backoffice-detail.component';


import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { FlashMessagesModule, FlashMessagesService } from 'flash-messages-angular';
import { JwtHelperService, JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthGuard } from './guard/auth.guard';
import { LessonService } from './services/lesson.service';
import { QuizService } from './services/quiz.service';
import { QuestionService } from './services/question.service';
import { UserService } from './services/user.service';
import { QuizDetailComponent } from './components/quiz-detail/quiz-detail.component';
import { QuestionComponent } from './components/question/question.component';
import { FormModalComponent } from './components/form-modal/form-modal.component';
import { SelectModalComponent } from './components/select-modal/select-modal.component';





@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    LessonComponent,
    ProfileComponent,
    QuizComponent,
    LessonBackofficeComponent,
    BackofficeComponent,
    LessonDetailComponent,
    DeleteConfirmationDialogComponent,
    UserBackofficeComponent,
    UserDetailComponent,
    LessonBackofficeDetailComponent,
    QuizBackofficeComponent,
    QuizBackofficeDetailComponent,
    QuestionBackofficeComponent,
    QuestionBackofficeDetailComponent,
    QuizDetailComponent,
    QuestionComponent,
    FormModalComponent,
    SelectModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FlashMessagesModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [ValidateService,
     AuthService,
      FlashMessagesService,{provide: JWT_OPTIONS, useValue: JWT_OPTIONS}, 
      JwtHelperService, 
      AuthGuard, 
      LessonService, 
      QuestionService, 
      QuizService, 
      UserService],
  bootstrap: [AppComponent],
})
export class AppModule { }
