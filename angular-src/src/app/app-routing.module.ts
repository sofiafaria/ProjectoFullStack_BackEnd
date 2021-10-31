import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LessonComponent } from './components/lesson/lesson.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin-guard.service';
import { ProfileComponent } from './components/profile/profile.component';
import { QuizDetailComponent } from './components/quiz-detail/quiz-detail.component';
import { LessonBackofficeComponent } from './components/lesson-backoffice/lesson-backoffice.component';
import { BackofficeComponent } from './components/backoffice/backoffice.component';
import { LessonDetailComponent } from './components/lesson-detail/lesson-detail.component';
import { UserBackofficeComponent } from './components/user-backoffice/user-backoffice.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { LessonBackofficeDetailComponent } from './components/lesson-backoffice-detail/lesson-backoffice-detail.component';
import { QuizBackofficeComponent } from './components/quiz-backoffice/quiz-backoffice.component';
import { QuizBackofficeDetailComponent } from './components/quiz-backoffice-detail/quiz-backoffice-detail.component';
import { QuestionBackofficeComponent } from './components/question-backoffice/question-backoffice.component';
import { QuestionBackofficeDetailComponent } from './components/question-backoffice-detail/question-backoffice-detail.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'lessons', component: LessonComponent, canActivate:[AuthGuard]},
  {path: 'lesson/:id', component: LessonDetailComponent, canActivate:[AuthGuard]},
  {path: 'quiz/lesson/:id', component:QuizDetailComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  {path: 'backoffice', component: BackofficeComponent, canActivate:[AdminGuard,AuthGuard]},
  {path: 'backoffice/lessons', component: LessonBackofficeComponent, canActivate:[AdminGuard,AuthGuard]},
  {path: 'backoffice/lesson/:id', component:LessonBackofficeDetailComponent, canActivate:[AdminGuard,AuthGuard]},
  {path: 'backoffice/questions', component: QuestionBackofficeComponent, canActivate: [AdminGuard,AuthGuard]},
  {path: 'backoffice/question/:id', component: QuestionBackofficeDetailComponent, canActivate: [AdminGuard,AuthGuard]},
  {path: 'backoffice/quizzes', component: QuizBackofficeComponent, canActivate: [AdminGuard,AuthGuard]},
  {path: 'backoffice/quiz/:id', component: QuizBackofficeDetailComponent, canActivate: [AdminGuard,AuthGuard]},
  {path: 'backoffice/users', component: UserBackofficeComponent, canActivate:[AdminGuard,AuthGuard]},
  {path: 'backoffice/user/:id', component: UserDetailComponent, canActivate:[AdminGuard,AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]

})

export class AppRoutingModule { }
