import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IAnswer } from 'src/app/models/Answer';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent implements OnInit {
  @Input() answer: IAnswer;
  //@Output() passBack: EventEmitter<IAnswer>;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {

  }

  closeModal(){
    this.activeModal.close('Modal Closed');
  }
  save(){
    //this.passBack.emit(this.answer);
    this.activeModal.close(this.answer);
  }

}
