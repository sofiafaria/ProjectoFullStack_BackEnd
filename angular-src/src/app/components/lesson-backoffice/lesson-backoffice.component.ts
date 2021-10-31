import { Component, OnInit } from '@angular/core';
import { ILesson } from 'src/app/models/Lesson';
import { LessonService } from 'src/app/services/lesson.service';
import { FlashMessagesService } from 'flash-messages-angular';

@Component({
  selector: 'app-lesson-backoffice',
  templateUrl: './lesson-backoffice.component.html',
  styleUrls: ['./lesson-backoffice.component.css']
})
export class LessonBackofficeComponent implements OnInit {

  lessons: Array<ILesson>;
  lesson: ILesson;

  constructor(private lessonService: LessonService,
              private flashMessageService: FlashMessagesService) { }

  ngOnInit(): void {
    //load the lessons on page initialize
    this.showLessons();
  }

  showLessons(){
    this.lessonService.getLessons().subscribe((lessons: any) =>{
      if(lessons.type=='success'){
        this.lessons = lessons.body; 
     }
   });

  }

  onDelete(id){
    if(confirm('Are you sure you want to delete this lesson?')){
      this.lessonService.deleteLesson(id).subscribe(() => this.lessons.filter(x => x._id!==id));
    }
    this.flashMessageService.show('Lesson deleted', {cssClass: 'alert alert-sucess', timeout: 3000});
    this.showLessons(); 
  }

}
