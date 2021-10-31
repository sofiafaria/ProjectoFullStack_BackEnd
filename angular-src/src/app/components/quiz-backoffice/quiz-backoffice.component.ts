import { Component, OnInit } from '@angular/core';
import { IQuiz } from 'src/app/models/Quiz';
import { QuizService } from 'src/app/services/quiz.service';
import { FlashMessagesService } from 'flash-messages-angular';

@Component({
  selector: 'app-quiz-backoffice',
  templateUrl: './quiz-backoffice.component.html',
  styleUrls: ['./quiz-backoffice.component.css']
})
export class QuizBackofficeComponent implements OnInit {

  quizzes: IQuiz[];
  quiz: IQuiz;

  constructor(private quizService: QuizService,
              private flashMessageService: FlashMessagesService) { }

  ngOnInit(): void {
    this.showQuizzes();
  }

  showQuizzes(){
    this.quizService.getQuizzes().subscribe((quizzes: any) =>{
      if(quizzes.type=='success'){
        this.quizzes = quizzes.body; 
     }
   });

  }

  onDelete(id){
    if(confirm('Are you sure you want to delete this quiz?')){
      this.quizService.deleteQuiz(id).subscribe(() => this.quizzes.filter(x => x._id!==id));
    }
    this.flashMessageService.show('Quiz deleted', {cssClass: 'alert alert-sucess', timeout: 3000});
    this.showQuizzes(); 
  }

}
