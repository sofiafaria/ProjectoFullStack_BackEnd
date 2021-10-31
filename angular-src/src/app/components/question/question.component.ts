
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IAnswer } from 'src/app/models/Answer';
import { IQuestion } from 'src/app/models/Question';
import { IUserAnswer } from 'src/app/models/UserAnswer';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent {

  @Input() question = {} as IQuestion;
  @Input() number = 0;
  @Output() setAnswer = new EventEmitter<IUserAnswer>();

  selectedAnswer = '';

  constructor() { }

  pickAnswer(questionId: string, option: IAnswer) {
    this.selectedAnswer = option.description;
    this.setAnswer.emit({ questionId: questionId, chosenOptionId: option._id, chosenOptionCorrect: option.correct });
  }

  onHover(id:string){
    document.getElementById(id).classList.add('border-primary');
  }
  onLeave(id:string){
    document.getElementById(id).classList.remove('border-primary');
  }

}
