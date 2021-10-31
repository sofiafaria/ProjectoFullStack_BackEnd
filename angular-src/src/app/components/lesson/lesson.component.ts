import { Component, OnInit } from '@angular/core';
import { ILesson } from 'src/app/models/Lesson';
import { LessonService } from 'src/app/services/lesson.service';
@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {
  lessons: Array<ILesson>;

  constructor(private lessonService: LessonService) { }

  ngOnInit(): void {
      //load the lessons on page initialize
      this.lessonService.getLessons().subscribe((lessons: any) =>{
        if(lessons.type =='success'){
          this.lessons = lessons.body;
        }
      });
  }

}
