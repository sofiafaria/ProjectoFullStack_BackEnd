import { Component, OnInit, Input, Output} from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-select-modal',
  templateUrl: './select-modal.component.html',
  styleUrls: ['./select-modal.component.css']
})
export class SelectModalComponent implements OnInit {

  questions: any[];
  selectedQuestions: any[]= [];

  constructor(private questionService: QuestionService,
              public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
        //load all questions
        this.questionService.getQuestions().subscribe((questions: any) =>{
          if(questions.type=='success'){
            this.questions = questions.body;
            this.questions.forEach(question => question.isChecked == false);
          }
        });
  }
  checkBox(question: any){
    question.isChecked=!question.isChecked;
  }
  closeModal(){
    this.activeModal.close('Modal Closed');
  }
  save(){
    this.selectedQuestions = this.questions.filter(question => question.isChecked ==true);
    this.activeModal.close(this.selectedQuestions);
  }

}
