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
  fileList: any[] = [];

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

           //display all the links associated with this lesson
           this.links = this.currLesson.links;
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

    //Required Fields
    if(!this.lessonService.validateLesson(lesson)){
      this.flashMessageService.show('Please fill in all fields', {cssClass: 'alert alert-danger', timeout: 3000});
      return;
    }

    if(!this.isEdit()){ //tem que se negar o false para entrar no if  - se não é uma edição cria-se

      //Create Lesson
        this.lessonService.createLesson(lesson).subscribe((data:any) => {
          if(data.type =='success'){
            let lessonId = data.body._id;
            //Se o objecto lesson foi criado com sucesso então podemos fazer upload dos files
            if(this.fileList.length>0){
              this.fileList.forEach(file => this.uploadFile(lessonId, file));
            }
            this.flashMessageService.show('Lesson created', {cssClass: 'alert alert-success', timeout: 3000});
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
      //if edit
      //first remove 
      if(this.fileList.length>0){
        this.fileList.forEach(file => {
       //eliminar ficheiro do servidor
          this.lessonService.deleteLessonFile(this.currLesson._id, file.name).subscribe((lesson: any) =>{
            if(lesson.type =='success'){
           //display all the links associated with this lesson
            this.currLesson.links = lesson.body.links; 
      //then update
            this.uploadFile(this.currLesson._id, file)
            }});
        });
      }

      console.log(this.links);
      console.log('links',this.currLesson.links);

      this.lessonService.updateLesson(lesson).subscribe((data: any) =>{
        if(data.type =='success'){
          this.flashMessageService.show('Lesson updated', {cssClass: 'alert alert-success', timeout: 3000});
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
        this.links.push(this.imageData);
        this.fileList.push(file);  
      }

      reader.readAsDataURL(file);
    }
    else{
      this.flashMessageService.show('File type is not allowed', {cssClass: 'alert alert-danger', timeout: 3000});
    }

  }

  removeImage(link){
    if(this.currLesson._id !=''){
          //eliminar ficheiro do servidor
          this.lessonService.deleteLessonFile(this.currLesson._id, link).subscribe((lesson: any) =>{
            if(lesson.type =='success'){
           //display all the links associated with this lesson
            this.currLesson.links = lesson.body.links;  
            this.flashMessageService.show('File was deleted', {cssClass: 'alert alert-success', timeout: 3000});
            }else{
              this.flashMessageService.show('File was not deleted', {cssClass: 'alert alert-danger', timeout: 3000});
            }});
          }
      this.links.splice(link,1);
}

  uploadFile (lessonId: string, file: File){
    this.lessonService.uploadLessonFile(lessonId, file).subscribe((data: any) =>{
      if(data.type =='success'){
        this.flashMessageService.show('Files were uploaded', {cssClass: 'alert alert-success', timeout: 3000});
      }else{
        this.flashMessageService.show('Files were not uploaded', {cssClass: 'alert alert-danger', timeout: 3000});
      }
  })
  }

}
