import { Quiz, IQuiz } from "../models/Quiz";
import { IMessage } from "../models/Message";
import { Request, Response } from 'express';
import { Result, ValidationError, validationResult } from "express-validator";
import { CallbackError, Document } from "mongoose";
class QuizController{

    public async getAll(req: Request, res: Response): Promise<Response>{

        try {
            const quizzes = await Quiz.find(req.query).populate('questions').populate('lesson');

            let message: IMessage = {
                http: 200,
                code: "QuizFound",
                type: "success"
            }

            if(quizzes.length <0){
                message = {
                    http: 204,
                    code: "NoQuizzes",
                    type: "success"
                };
            }

            message.body = quizzes;
            return res.status(message.http).json(message);
            
        } catch (error) {
            return res.status(400).json({http: 400,
                code: "BadRequest",
                type: "error"});
            
        }


    }

    public async getOne(req: Request, res: Response): Promise<Response>{

        const errors: Array<ValidationError> = validationResult(req).array();

        if(errors.length > 0) return res.status(406).send(errors);

        try {
            let message: IMessage = {
                http: 200,
                code: "QuizFound",
                type: "success"
            };
            message.body = await Quiz.findOne({_id: req.params.id}).populate('questions').populate('lesson');
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

        try {

            //Validate unique quiz-lesson relation
            let quizSearch = await Quiz.findOne({'lesson': req.body.lesson});

            if(quizSearch){
                let message: IMessage = {
                    code: "QuizAlreadyExists",
                    http: 409,
                    type: "error"
                }
                return res.status(message.http).json(message);
            }
            //if not continue

            if(req.body.questions.length ==0){
                let message: IMessage = {
                    code: "MustHaveAtLeastOneQuestion",
                    http: 411,
                    type: "error"
                }
                return res.status(message.http).json(message);
            }

            const quiz : Document<IQuiz> = new Quiz({
                name: req.body.name,
                points: req.body.points,
                hidden: req.body.hidden,
                lesson: req.body.lesson,
                questions: req.body.questions,
                level: req.body.level,
                description: req.body.description
            });

            await (await (await quiz.save()).populate('lesson')).populate('questions',error =>{
                if(error) throw error});
                let message: IMessage = {
                    code: "QuizCreated",
                    http: 201,
                    type: "success"
                };
                message.body = quiz;
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
            const quiz : Document<IQuiz> = await Quiz.findOneAndUpdate({_id : req.params.id}, {$set: req.body},{new: true});
            if(!quiz){
                return res.status(404)
                .json({
                    http: 404,
                    code: "QuizNotFound",
                    type: "error"}
                    );
            }
            await (await quiz.populate('questions')).populate('lesson');

            let message :IMessage= {
                http: 200,
                code: "QuizUpdated",
                type: "success"
            };
            message.body = quiz;
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
            const quiz = await Quiz.deleteOne({_id: req.params.id});
            if(quiz.deletedCount<=0){
                return res.status(404)
                    .json({
                        http: 404,
                        code: "QuizNotFound",
                        type: "error"}
                        );
            }
            let message :IMessage= {
                http: 200,
                code: "QuizDeleted",
                type: "success"
            };
            return res.status(message.http).json(message);   
        } catch (error) {
            return res.status(400).json({http: 400,
                code: "BadRequest",
                type: "error"});
            
        }
    }

    public async getOneByLessonId(req:Request, res:Response): Promise<Response>{
        const errors: Array<ValidationError> = validationResult(req).array(); 
        
        if(errors.length > 0) return res.status(406).json(errors);
        
        try {
            let message: IMessage = {
                http: 200,
                code: "QuizFound",
                type: "success"
            };
            message.body = await Quiz.findOne({lesson: req.params.id, is_active: true}).populate('questions').populate('lesson');
            return res.status(message.http).json(message);
            
        } catch (error) {
            return res.status(404).json('Not Found');
        }
    }



    public async active(req: Request, res: Response): Promise<Response>{
        const errors: Array<ValidationError> = validationResult(req).array();

        if(errors.length > 0) return res.status(406).json(errors);

        try {
            const quiz = await Quiz.updateOne({_id: req.params.id}, {$set: { is_active: true}});
            if(quiz.upsertedCount <=0){
                return res.status(404).json({
                    http: 404,
                    code: "QuizNotFound",
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
            const quiz = await Quiz.updateOne({_id: req.params.id}, {$set: { is_active: false}});
            if(quiz.upsertedCount <=0){
                return res.status(404).json({
                    http: 404,
                    code: "QuizNotFound",
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
export default new QuizController();