import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'flash-messages-angular';
import { IQuiz } from 'src/app/models/Quiz';
import { QuizService } from 'src/app/services/quiz.service';
import { IQuestion } from 'src/app/models/Question';
import { LessonService } from 'src/app/services/lesson.service';
import { ILesson } from 'src/app/models/Lesson';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectModalComponent } from '../select-modal/select-modal.component';
@Component({
  selector: 'app-quiz-backoffice-detail',
  templateUrl: './quiz-backoffice-detail.component.html',
  styleUrls: ['./quiz-backoffice-detail.component.css']
})
export class QuizBackofficeDetailComponent implements OnInit {

    name: string;
    points: number;
    level: number;
    date: Date;
    is_active: boolean;
    newQuestion: IQuestion;
    @Input() currQuiz: IQuiz;
    @Input() currQuestions;
    @Input() lessons: Array<ILesson>;
    @Input() questions: any[];

  constructor(private quizService: QuizService,
    private lessonService: LessonService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private flashMessageService: FlashMessagesService,
    private router: Router) { }

  ngOnInit(): void {
    //load the quiz detail on page initialize
    const id = this.route.snapshot.paramMap.get('id');
    if(id == '0'){
      this.currQuiz={
        _id: '',
        name: '',
        points: 0, 
       level: 0,
       lesson:'',
       is_active: true,
       date: new Date(),
       questions: []
      }
      this.currQuestions = this.currQuiz.questions;
    }else{
      this.quizService.getQuiz(id).subscribe((quiz: any) =>{
        if(quiz.type =='success'){
          this.currQuiz = quiz.body;
          this.currQuestions = quiz.body.questions;

        }
      });
    }
    //load all lessons
    this.lessonService.getLessons().subscribe((lessons: any) =>{
      if(lessons.type=='success'){
        this.lessons = lessons.body.filter((lesson: IQuestion) => lesson.is_active == true); 
      }
    });
  }

  isEdit():Boolean{
    const id = this.route.snapshot.paramMap.get('id');
    return !(id == '0');
  }

  onQuizSubmit(){
    
    const quiz = this.currQuiz;
    //Required Fields
    if(!this.quizService.validateQuiz(quiz)){
      this.flashMessageService.show('Please fill in all fields', {cssClass: 'alert alert-danger', timeout: 3000});
      return;
    }

    if(!this.isEdit()){ //tem que se negar o false para entrar no if  - se não é uma edição cria-se

      //Create Quiz
        this.quizService.createQuiz(quiz).subscribe((data:any) => {
          if(data.type =='success'){
            this.flashMessageService.show('Quiz created', {cssClass: 'alert alert-success', timeout: 3000});
            this.router.navigate(['backoffice/quizzes']);
    
          }else{
            this.flashMessageService.show('Something went wrong', {cssClass: 'alert alert-danger', timeout: 3000});
          }
        },
        (err: any) =>{
          this.flashMessageService.show(err.code, {cssClass: 'alert-danger', timeout: 3000});
        }
        );
    }else{
      this.quizService.updateQuiz(quiz).subscribe((data: any) =>{
        if(data.type =='success'){
          this.flashMessageService.show('Quiz updated', {cssClass: 'alert alert-success', timeout: 3000});
          this.router.navigate(['backoffice/quizzes']);        
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

  openSelectModal(){

      const modalRef= this.modalService.open(SelectModalComponent);
      modalRef.result.then((results: IQuestion[]) =>{
        results.forEach(result => {
          if(this.currQuestions.findIndex(question => question._id == result._id) <0){
            this.currQuestions.push(result);
          }
        });
      }).catch((error) =>{
        console.log(error);
      });

      this.currQuestions.forEach(question =>{
        if(!this.currQuiz.questions.includes(question._id)){
          this.currQuiz.questions.push(question._id);
        }
      });

      //console.log(this.currQuiz);



  }
  remove(question: any){
    this.currQuestions.splice(question,1);
  }
  

}
