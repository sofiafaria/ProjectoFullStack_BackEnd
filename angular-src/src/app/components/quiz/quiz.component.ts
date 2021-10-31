import { Component, OnInit } from '@angular/core';
import { IQuiz } from 'src/app/models/Quiz';
import { QuizService } from 'src/app/services/quiz.service';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quizzes: Array<IQuiz>;

  constructor(private quizService: QuizService) { }

  ngOnInit(): void {
    //load the quizzes on page initialize
    this.quizService.getQuizzes().subscribe((quizzes: any) =>{
      if(quizzes.type =='success'){
        this.quizzes = quizzes.body;
      }
    });
  }
}
