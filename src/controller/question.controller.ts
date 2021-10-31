import { Question, IQuestion } from "../models/Question";
import { IMessage } from "../models/Message";
import { Request, Response } from 'express';
import { Result, ValidationError, validationResult } from "express-validator";
import { CallbackError, Document, Unpacked } from "mongoose";
class QuestionController{

    public async getAll(req: Request, res: Response): Promise<Response>{

        try {
            const questions = await Question.find(req.query).populate('answers');

            let message: IMessage = {
                http: 200,
                code: "QuestionFound",
                type: "success"
            }

            if(questions.length <0){
                message = {
                    http: 204,
                    code: "NoQuestions",
                    type: "success"
                };
            }

            message.body = questions;
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
                code: "QuestionFound",
                type: "success"
            };
            message.body = await Question.findOne({_id: req.params.id}).populate('answers');
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

        if(req.body.answers.length==0){
            let message: IMessage = {
                code: 'MutsHaveAtLeastOneAnswer',
                http: 411,
                type: 'error'
            };
            return res.status(message.http).json(message);
        };

        let answers = req.body.answers.filter((answer: any) => {
            return answer.correct ==true;
        });

        if(answers.length==0){
            let message: IMessage = {
                code: 'MutsHaveOneCorrectAnswer',
                http: 411,
                type: 'error'
            };
            return res.status(message.http).json(message);
        }else if(answers.length>1){
            let message: IMessage = {
                code: 'CanOnlyHaveOneCorrectAnswer',
                http: 411,
                type: 'error'
            };
            return res.status(message.http).json(message);
        }

        try {
            const question : Document<IQuestion> = new Question({
                question: req.body.question,
                group: req.body.group,
                type: req.body.type,
                description: req.body.description,
                title: req.body.title,
                answers: req.body.answers,
                level: req.body.level

            });
        
            await question.save();
            let message: IMessage = {
                code: "QuestionCreated",
                http: 201,
                type: "success"
                };
            message.body = question;
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

        //validate if there's more than one correct answer
        // await Question.findOne({_id: req.params.id}).populate('answers').exec((error, question) => {
        //     if(question?.answers){
        //         let checkCorrectArray: Array<number> | undefined = question?.answers.map((answer) => answer.correct ? 1: 0);
        //         console.log(checkCorrectArray);
        //         let countChecks = checkCorrectArray?.reduce((acc: number, element: number) => acc+element)
        //         if(countChecks>1){
        //             return res.status(409)
        //         .json({
        //             http: 409,
        //             code: "QuestionHasMoreThanOneAnswerCorrect",
        //             type: "error"}
        //             );
        //         }
        //     }

        // })

        try {
            const question : Document<IQuestion> = await Question.findOneAndUpdate({_id : req.params.id}, {$set: req.body},{new: true});
            if(!question){
                return res.status(404)
                .json({
                    http: 404,
                    code: "QuestionNotFound",
                    type: "error"}
                    );
            }
            await question.populate('answers');
            let message :IMessage= {
                http: 200,
                code: "QuestionUpdated",
                type: "success"
            };



            message.body = question;
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
            const question = await Question.deleteOne({_id: req.params.id});
            if(question.deletedCount<=0){
                return res.status(404)
                    .json({
                        http: 404,
                        code: "QuestionNotFound",
                        type: "error"}
                        );
            }
            let message :IMessage= {
                http: 200,
                code: "QuestionDeleted",
                type: "success"
            };
            return res.status(message.http).json(message);   
        } catch (error) {
            return res.status(400).json({http: 400,
                code: "BadRequest",
                type: "error"});
            
        }
    }
    public async active(req: Request, res: Response): Promise<Response>{
        const errors: Array<ValidationError> = validationResult(req).array();

        if(errors.length > 0) return res.status(406).json(errors);

        try {
            const question = await Question.updateOne({_id: req.params.id}, {$set: { is_active: true}});
            if(question.upsertedCount <=0){
                return res.status(404).json({
                    http: 404,
                    code: "QuestionNotFound",
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
            const question = await Question.updateOne({_id: req.params.id}, {$set: { is_active: false}});
            if(question.upsertedCount <=0){
                return res.status(404).json({
                    http: 404,
                    code: "QuestionNotFound",
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
export default new QuestionController();