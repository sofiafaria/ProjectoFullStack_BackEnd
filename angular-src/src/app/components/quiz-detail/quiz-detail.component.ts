import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IQuiz } from 'src/app/models/Quiz';
import { QuizService } from 'src/app/services/quiz.service';
import { IQuestion } from 'src/app/models/Question';
import { QuestionService } from 'src/app/services/question.service';
import { IUserAnswer } from 'src/app/models/UserAnswer';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/models/User';
import { FlashMessagesService } from 'flash-messages-angular';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quiz-detail',
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.css']
})
export class QuizDetailComponent implements OnInit {

  quiz!: IQuiz;
  quizId: string ='';
  questions: IQuestion[] = [];
  userAnswers: IUserAnswer[] = [];
  currUser: IUser;
  closeResult: string;
  results: IUserAnswer[];
  enableModal:boolean = false;
  currentRoute: string;

  constructor(private quizService: QuizService,
    private questionService:QuestionService,
    private userService: UserService,
    private authService: AuthService,
    private modalService: NgbModal,
    private flashMessageService: FlashMessagesService,
    private route: ActivatedRoute,
    private router: Router) { }



  ngOnInit(): void {
      //load the quiz detail on page initialize
      const id = this.route.snapshot.paramMap.get('id');
      if(id == '0'){
        return;
      }else{
        this.quizService.getQuizByLesson(id).subscribe((quiz: any) =>{
          if(quiz.type =='success'){
            this.quiz = quiz.body;
            if(this.quiz == null){
              return;
            }
            if(quiz.body.questions.length ==0){
              this.quiz.questions=[];
              return;
            }
            quiz.body.questions.forEach((question: IQuestion) => {
              if(question.is_active){
                this.questions.push(question);
              }
              });
            };   
          })
      }
      //load user
      const localUser = this.authService.loadUserId();
      this.userService.getUser(localUser).subscribe((user:any) =>{
       if(user.type =='success'){
         this.currUser = user.body
       }
     });
  }

   setAnswerValue(option: IUserAnswer) {
     if(this.userAnswers.length>0){
        const searchPosition: number = this.userAnswers.findIndex((answer:IUserAnswer) => option.questionId == answer.questionId);
     if(searchPosition >=0){
      this.userAnswers.splice(searchPosition,1);
     }
    }
     this.userAnswers.push(option);
   }

  score() {
      confirm('Are you sure you want to finish this quiz?');
      if(!confirm){
        return;
      }
      this.results = this.userAnswers;
      for (let i =0; i<this.questions.length; i++){
        //verificamos se o utilizador respondeu a todas as questões. Caso não tenha respondido adicionamos um noanswer ao array de resultados
        let check: number =this.results.findIndex((answer: IUserAnswer) => this.questions[i]._id == answer.questionId);
        if(check<0){
          let noanswer: IUserAnswer = {
            questionId: this.questions[i]._id,
            chosenOptionId: '0',
            chosenOptionCorrect: false,
            correctOptionId: this.questions[i].answers.find(answer => answer.correct=true)._id
          }
          this.results.push(noanswer);
        }
      }
      //verificamos se as responstas dadas ao quiz estão certas ou erradas, substituindo por 1 todas as certas e 0 todas as erradas
      const pointsArray: Array<number> =this.results.map((answer:IUserAnswer) => (answer.chosenOptionCorrect == true) ? 1 : 0);
      let correct = pointsArray.reduce((acc: number, result: number) => acc +result,0);
      let incorrect = this.results.length- correct;

      //adicionar pontos ao user se completou o quiz com sucesso
      if(incorrect == 0){

        //verifica se utilizador já respondeu ao quiz anteriormente
        let quizIndex = this.currUser.gamification.quiz.findIndex((quizId: string) => quizId == this.quiz._id);
        if(quizIndex >=0){
          this.flashMessageService.show(`User has already completed this quiz. No points were added!`, {cssClass: 'alert alert-success', timeout: 3000});
          return;
        }
                         
        //adicionar pontos ao user
        this.currUser.gamification.points = this.currUser.gamification.points + this.quiz.points;  
        //adiciona quiz aos já jogados pelo user
        this.currUser.gamification.quiz.push(this.quiz._id);
        //actualizar o user
        this.userService.updateUser(this.currUser).subscribe((data: any) =>{
          if(data.type =='success'){
            this.flashMessageService.show(`User has now ${this.currUser.gamification.points} points!`, {cssClass: 'alert alert-success', timeout: 3000});
          }else{
            this.flashMessageService.show('Something went wrong', {cssClass: 'alert alert-danger', timeout: 3000});
          }
        });
    }else{
          //mostrar ao utilizador caso tenha respostas incorrectas
          this.flashMessageService.show('You failed some of the questions. Click on Show Answers to review your answers', {cssClass: 'alert alert-danger', timeout: 3000});
          this.enableModal = true;
    }
  }
  triggerModal(content){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult =`Closed with ${result}`;
    }, (reason) =>{
      this.closeResult = `Dismissed ${this.getDismissedReason(reason)}`;
    });
  }

  private getDismissedReason(reason: any): string{
    if(reason === ModalDismissReasons.ESC){
      return 'by pressing ESC';
    }else if(reason ===ModalDismissReasons.BACKDROP_CLICK){
      return 'by clicking a backdrop';
    }else{
      return `with: ${reason}`;
    }
  }

  returnToCurrentRoute(){
   this.route.url.subscribe((url:any) => this.currentRoute = url);
  }
}
