import { ILesson, Lesson } from "../models/Lesson";
import { IMessage } from '../models/Message';
import { Request, Response } from 'express';
import { Result, ValidationError, validationResult } from "express-validator";
import { CallbackError, Document } from "mongoose";
import fs from 'fs';
import path from 'path';

class LessonController{

    public async getAll(req: Request, res: Response): Promise<Response>{
        try {
            const lessons = await Lesson.find(req.query).populate('comment.user', 'name').lean();

            let message: IMessage = {
                http: 200,
                code: "LessonFound",
                type: "success"
            }

            if(lessons.length <0){
                message = {
                    http: 204,
                    code: "NoLessons",
                    type: "success"
                };
            }

            message.body = lessons;
            return res.status(message.http).json(message);
            
        } catch (error) {
            return res.status(400).json({http: 400,
                code: "BadRequest",
                type: "error"});
            
        }


    }

    public async getOne(req: Request, res: Response): Promise<Response>{

        const errors: Array<ValidationError> = validationResult(req).array();

        if(errors.length > 0) return res.status(406).json(errors);

        try {
            let message: IMessage = {
                http: 200,
                code: "LessonFound",
                type: "success"
            };
            message.body = await Lesson.findOne({_id: req.params.id}).populate('comment.user', 'name').populate('links');
            return res.status(message.http).json(message);
            
        } catch (error) {
            return res.status(404).json('Not Found');
        }
    }

    public async create(req: Request, res: Response): Promise<Response>{
        const errors: Array<ValidationError> = validationResult(req).array();
        if(errors.length>0){
            return res.status(406).json(errors);
        }

        //console.log(req);

        try {
            const lesson : Document<ILesson> = new Lesson({
                name: req.body.name,
                group: req.body.group,
                description: req.body.description,
                level: req.body.level,
                links: req.body.links
    
            });
        
            await (await lesson.save()).populate('links');

            let message: IMessage = {
                code: "LessonCreated",
                http: 201,
                type: "success"
                };
            message.body = lesson;
            return res.status(message.http).json(message);
        } catch (error) {
            return res.status(400).json({http: 400,
                code: "BadRequest",
                type: "error"});
        
        }
    }

    public async update(req: Request, res: Response): Promise<Response>{
        const errors: Array<ValidationError> = validationResult(req).array();

        if(errors.length > 0) return res.status(406).json(errors);

        try {
            const lesson : Document<ILesson> = await Lesson.findOneAndUpdate({_id : req.params.id}, {$set: req.body},{new: true});
            if(!lesson){
                return res.status(404)
                .json({
                    http: 404,
                    code: "LessonNotFound",
                    type: "error"}
                    );
            }
            let message :IMessage= {
                http: 200,
                code: "LessonUpdated",
                type: "success"
            };
            message.body = lesson;
            return res.status(message.http).json(message);
            
        } catch (error) {
            return res.status(400).json({http: 400,
                code: "BadRequest",
                type: "error"});
        }

    }
    public async delete(req: Request, res: Response): Promise<Response>{
        const errors: Array<ValidationError> = validationResult(req).array();
        if(errors.length > 0) return res.status(406).json(errors);

        try {
            const lesson = await Lesson.deleteOne({_id: req.params.id});
            if(lesson.deletedCount<=0){
                return res.status(404)
                    .json({
                        http: 404,
                        code: "LessonNotFound",
                        type: "error"}
                        );
            }
            //Listar todos os ficheiros na directoria publica das imagens. Para cada um se encontrar lessonId na descrição remove ficheiro
            let folder = path.join(__dirname, '../../public/images/');
            fs.readdir(folder, (err, files) => {
                files.forEach((file: string) => {
                    if(file.includes(req.params.id)){
                        fs.unlink(`${folder}${file}`,(err) => console.log(err));
                    }
                });
              });
            let message :IMessage= {
                http: 200,
                code: "LessonDeleted",
                type: "success"
            };
            return res.status(message.http).json(message);   
        } catch (error) {
            return res.status(400).json({http: 400,
                code: "BadRequest",
                type: "error"});
            
        }
    }

    public async createFile(req: Request, res: Response): Promise<Response>{
       //caminho queguarda o destino da imagem
        const path = 'http://localhost:3000/images/' + req.file?.filename;
        try{
            const links = await Lesson.findOne({_id : req.params.id}).select('links');
            if(!links){
                try {
                    const lesson = await Lesson.updateOne({_id : req.params.id}, {$push: {links : path}},{new: true});
                    if(!lesson){
                        return res.status(404)
                        .json({
                            http: 404,
                            code: "LessonNotFound",
                            type: "error"}
                            );
                    }
                    let message :IMessage= {
                        http: 200,
                        code: "FileUploaded",
                        type: "success"
                    };
                    message.body = lesson;
                    return res.status(message.http).json(message);
                    
                } catch (error) {
                    return res.status(400).json({http: 400,
                        code: "BadRequest",
                        type: "error"});
                }

            }else{
                try{
                    const lesson = await Lesson.updateOne({_id : req.params.id}, {$push: {links : path}},{new: true});      
                    let message :IMessage= {
                        http: 200,
                        code: "FileUploaded",
                        type: "success"
                    };
                    message.body = lesson;
                    return res.status(message.http).json(message);

                }catch(error){
                    return res.status(404).json({http: 400,
                        code: "BadRequest",
                        type: "error"});
                    
                }
            }
        }catch(error){
            return res.status(404).json({http: 400,
                code: "BadRequest",
                type: "error"});
        }
           
    }

    public async deleteFile(req: Request, res: Response): Promise<Response>{
        let reqPath = path.join(__dirname, '../../public/images/')+req.params.fileId;
        let linkPath =  'http://localhost:3000/images/' + req.params.fileId;
       
        try{
            const lesson = await Lesson.findOneAndUpdate({_id : req.params.id}, {$pull: {links: linkPath}},{new: true});   
                    let message :IMessage= {
                        http: 200,
                        code: "FileUploaded",
                        type: "success"
                    };
                    fs.unlink(reqPath,(err) =>console.log(err));
                    message.body = lesson;
                    return res.status(message.http).json(message);
        }catch(error){
            return res.status(400).json({http: 400,
                code: "BadRequest",
                type: "error"});
        }
    }



    public async active(req: Request, res: Response): Promise<Response>{
        const errors: Array<ValidationError> = validationResult(req).array();

        if(errors.length > 0) return res.status(406).json(errors);

        try {
            const lesson = await Lesson.updateOne({_id: req.params.id}, {$set: { is_active: true}});
            if(lesson.upsertedCount <=0){
                return res.status(404).json({
                    http: 404,
                    code: "LessonNotFound",
                    type: "error"});
            }
            let message :IMessage= {
                http: 200,
                code: "Activated",
                type: "success"
            }
            return res.status(message.http).json(message);
            
            
        } catch (error) {

            return res.status(404).json({http: 400,
                code: "BadRequest",
                type: "error"});
            
        }
        
    }
    public async inactive(req: Request, res: Response): Promise<Response>{
        const errors: Array<ValidationError> = validationResult(req).array();

        if(errors.length > 0) return res.status(406).json(errors);

        try {
            const lesson = await Lesson.updateOne({_id: req.params.id}, {$set: { is_active: false}});
            if(lesson.upsertedCount <=0){
                return res.status(404).json({
                    http: 404,
                    code: "LessonNotFound",
                    type: "error"});
            }
            let message :IMessage= {
                http: 200,
                code: "Deactivated",
                type: "success"
            }
            return res.status(message.http).json(message);
        } catch (error) {
            return res.status(404).json({http: 400,
                code: "BadRequest",
                type: "error"});
        }
    }

}
export default new LessonController();