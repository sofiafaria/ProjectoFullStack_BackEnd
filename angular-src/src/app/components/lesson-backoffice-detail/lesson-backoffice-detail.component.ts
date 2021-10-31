import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'flash-messages-angular';
import { ILesson } from 'src/app/models/Lesson';
import { LessonService } from 'src/app/services/lesson.service';

@Component({
  selector: 'app-lesson-backoffice-detail',
  templateUrl: './lesson-backoffice-detail.component.html',
  styleUrls: ['./lesson-backoffice-detail.component.css']
})
export class LessonBackofficeDetailComponent implements OnInit {
  name: string;
  group: string; 
  description: string;
  level: number;
  is_active: boolean;
  imageData: string;
  formData:FormData = new FormData();
  links: string[] =[];

  @Input() currLesson: ILesson;

  constructor(private lessonService: LessonService,
              private route: ActivatedRoute,
              private flashMessageService: FlashMessagesService,
              private router: Router) { }

  ngOnInit(): void {
       //load the lesson detail on page initialize
       const id = this.route.snapshot.paramMap.get('id');
       if(id == '0'){
         this.currLesson={
           _id: '',
           name: '',
           group: '', 
          description: '',
          level: 0,
          is_active: true,
          links:[]
         }
       }else{
         this.lessonService.getLesson(id).subscribe((lesson: any) =>{
           if(lesson.type =='success'){
             this.currLesson = lesson.body;
           }
         });
       }
  }
  isEdit():Boolean{
    const id = this.route.snapshot.paramMap.get('id');
    return !(id == '0');
  }

  onLessonSubmit(){

    const lesson = this.currLesson;
    console.log(lesson);

    //Required Fields
    if(!this.lessonService.validateLesson(lesson)){
      this.flashMessageService.show('Please fill in all fields', {cssClass: 'alert alert-danger', timeout: 3000});
      return;
    }

    if(!this.isEdit()){ //tem que se negar o false para entrar no if  - se não é uma edição cria-se

      //Create Lesson
        this.lessonService.createLesson(lesson).subscribe((data:any) => {
          if(data.type =='success'){
            this.flashMessageService.show('Lesson created', {cssClass: 'alert alert-sucess', timeout: 3000});
            this.router.navigate(['backoffice/lessons']);
    
          }else{
            this.flashMessageService.show('Something went wrong', {cssClass: 'alert alert-danger', timeout: 3000});
          }
        },
        (err: any) =>{
          this.flashMessageService.show(err.code, {cssClass: 'alert-danger', timeout: 3000});
        }
        );
    }else{
      this.lessonService.updateLesson(lesson).subscribe((data: any) =>{
        if(data.type =='success'){
          this.flashMessageService.show('Lesson updated', {cssClass: 'alert alert-sucess', timeout: 3000});
          this.router.navigate(['backoffice/lessons']);        
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
  onFileSelect(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    //Por enquanto só vamos autorizar imagens. Futuramente poderão ser vídeos ou pdfs
    const allowedMimeFiles = ["image/png","image/jpeg","image/jpg"];
    if(file && allowedMimeFiles.includes(file.type)){
      const reader = new FileReader();
      reader.onload=() =>{
        this.imageData = reader.result as string;
          //adicionar ao array de imagens
      //  this.currLesson.links.push({
      //   type: file.type,
      //   path: file.name
      // });
      this.currLesson.links.push(file.name);
        this.links.push(this.imageData);      
      }

      reader.readAsDataURL(file);
    }
    else{
      this.flashMessageService.show('File type is not allowed', {cssClass: 'alert alert-danger', timeout: 3000});
    }

  }

  removeImage(link){
    this.links.splice(link,1);
    //this.formData.delete(link.type);
  }

}
