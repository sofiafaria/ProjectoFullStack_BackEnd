import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'flash-messages-angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IAnswer } from 'src/app/models/Answer';
import { IQuestion } from 'src/app/models/Question';
import { QuestionService } from 'src/app/services/question.service';
import { FormModalComponent } from '../form-modal/form-modal.component';

@Component({
  selector: 'app-question-backoffice-detail',
  templateUrl: './question-backoffice-detail.component.html',
  styleUrls: ['./question-backoffice-detail.component.css']
})
export class QuestionBackofficeDetailComponent implements OnInit {

  question: string;
  title: string;
  description: string;
  group: string;
  level: number;
  type: string;
  date: Date;
  answers: Array<IAnswer>;
  is_active: boolean;
  answer: IAnswer;

  closeResult: string;

  @Input() currQuestion: IQuestion;
 // @Output() newAnswer: EventEmitter<IAnswer> = new EventEmitter();
  newAnswer: IAnswer;

  constructor(private questionService: QuestionService,
    private route: ActivatedRoute,
    private flashMessageService: FlashMessagesService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    //load the question detail on page initialize
    const id = this.route.snapshot.paramMap.get('id');
    if(id == '0'){
      this.currQuestion={
        _id: '',
        question: '',
        title: '',
        description: '',
        group: '',
        type: '',
       level: 0,
       is_active: true,
       date: new Date(),
       answers: [{
         title:'',
         description:'',
         correct: false
       }]
      }
    }else{
      this.questionService.getQuestion(id).subscribe((question: any) =>{
        if(question.type =='success'){
          this.currQuestion = question.body;
        }
      });
    }

  }


  isEdit():Boolean{
    const id = this.route.snapshot.paramMap.get('id');
    return !(id == '0');
  }


  onQuestionSubmit(){
    const question = this.currQuestion;

    //Required Fields
    if(!this.questionService.validateQuestion(question)){
      this.flashMessageService.show('Please fill in all fields', {cssClass: 'alert alert-danger', timeout: 3000});
      return;
    }

    if(!this.isEdit()){ //tem que se negar o false para entrar no if  - se não é uma edição cria-se

      //Create Question
        this.questionService.createQuestion(question).subscribe((data:any) => {
          if(data.type =='success'){
            this.flashMessageService.show('Question created', {cssClass: 'alert alert-sucess', timeout: 3000});
            this.router.navigate(['backoffice/questions']);
    
          }else{
            this.flashMessageService.show('Something went wrong', {cssClass: 'alert alert-danger', timeout: 3000});
          }
        },
        (err: any) =>{
          this.flashMessageService.show(err.code, {cssClass: 'alert-danger', timeout: 3000});
        }
        );
    }else{
      this.questionService.updateQuestion(question).subscribe((data: any) =>{
        if(data.type =='success'){
          this.flashMessageService.show('Question updated', {cssClass: 'alert alert-sucess', timeout: 3000});
          this.router.navigate(['backoffice/questions']);        
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

  openFormModal(answer?: any){
    if(!answer){
      answer ={
        title: '',
        description:'',
        correct:true
      }
    const modalRef= this.modalService.open(FormModalComponent);
    modalRef.componentInstance.answer = answer;
    modalRef.result.then((result: IAnswer) =>{
      this.newAnswer = result;
      this.currQuestion.answers.push(this.newAnswer);
      
    }).catch((error) =>{
      console.log(error);
    });
    }else{
      const modalRef= this.modalService.open(FormModalComponent);
      modalRef.componentInstance.answer = answer;
      modalRef.result.then((result: IAnswer) =>{
        this.newAnswer = result;
      }).catch((error) =>{
        console.log(error);
      });

    }

  }
  remove(answer: any){
    this.currQuestion.answers.splice(answer,1);
  }
}


