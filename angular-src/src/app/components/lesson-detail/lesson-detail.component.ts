import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILesson } from 'src/app/models/Lesson';
import { LessonService } from 'src/app/services/lesson.service';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.css']
})
export class LessonDetailComponent implements OnInit {
  lesson:ILesson;

  constructor(private lessonService: LessonService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    //load the lesson detail on page initialize
    const id = this.route.snapshot.paramMap.get('id');
    if(id == '0'){
      return;
    }else{
      this.lessonService.getLesson(id).subscribe((lesson: any) =>{
        if(lesson.type =='success'){
          this.lesson = lesson.body;
        }
      });
    }
  }

}
