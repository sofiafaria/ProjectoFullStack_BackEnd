import { Component, OnInit } from '@angular/core';
import { IQuestion } from 'src/app/models/Question';
import { QuestionService } from 'src/app/services/question.service';
import { FlashMessagesService } from 'flash-messages-angular';

@Component({
  selector: 'app-question-backoffice',
  templateUrl: './question-backoffice.component.html',
  styleUrls: ['./question-backoffice.component.css']
})
export class QuestionBackofficeComponent implements OnInit {

  questions: IQuestion[];
  question: IQuestion;

  constructor(private questionService: QuestionService,
              private flashMessageService: FlashMessagesService) { }

  ngOnInit(): void {
    this.showQuestions();
  }

  showQuestions(){
    this.questionService.getQuestions().subscribe((questions: any) =>{
      if(questions.type=='success'){
        this.questions = questions.body; 
     }
   });

  }

  onDelete(id){
    if(confirm('Are you sure you want to delete this question?')){
      this.questionService.deleteQuestion(id).subscribe(() => this.questions.filter(x => x._id!==id));
    }
    this.flashMessageService.show('Question deleted', {cssClass: 'alert alert-success', timeout: 3000});
    this.showQuestions(); 
  }

}
