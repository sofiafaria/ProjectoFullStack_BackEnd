import { Request, Response } from 'express';
import { Result, ValidationError, validationResult } from "express-validator";
import {IUser, User } from '../models/User';
import { Lesson } from "../models/Lesson";
import { IMessage } from '../models/Message';
import { Document } from 'mongoose';

class UserController {
    public async getAll (req: Request, res: Response): Promise<Response>{
        try {
            let users = await User.find(req.query);

            let message : IMessage = {            
                http: 200,
                code: "UserFound",
                type: "success"
            };
            //caso nao retorne users
            if(users.length< 0){
                let message: IMessage = {http: 204,
                code: "NoUsers",
                type: "success"
                }
            }
            message.body = users;
            return res.status(message.http).json(message);
            
        } catch (error) {
            return res.status(400).json(
                {http: 400,
                code: "BadRequest",
                type: "error"});   
        }
    }
    public async getOne (req: Request, res: Response): Promise<Response>{
        const errors = validationResult(req).array();
        if (errors.length > 0) return res.status(406).send(errors);
    
        try {
            const user = await User.findOne({_id: req.params.id});
            if(!user){
                return res.status(404).json({http: 404,
                    code: "UserNotFound",
                    type: "error"});
            }
            let message : IMessage = {
                http: 200,
                code: "UserFound",
                type: "success"
            };
            message.body = user;
            return res.status(message.http).json(message);
            
        } catch (error) {
            return res.status(400).json({http: 400,
                code: "BadRequest",
                type: "error"});   
        }
    }
    
    public async update(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req).array();
        if (errors.length > 0) return res.status(406).send(errors);
        try {
            const user = await User.findOneAndUpdate({_id: req.params.id},{$set : req.body}, {new: true});

            //Se não existe
            if(!user){
                let message: IMessage = {            
                    http: 404,
                    code: "UserNotFound",
                    type: "error"
                };
                return res.status(message.http).json(message);
            }
    //encriptar a password novamente

            let message: IMessage = {
                http: 200,
                code: "UserUpdated",
                type: "success"
            };
            message.body = user;
            res.status(message.http).json(message);

        } catch (error) {
            return res.status(400).json({http: 400,
                code: "BadRequest",
                type: "error"});
        }
        return res;
    }
    public async delete(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req).array();
        if (errors.length > 0) return res.status(406).send(errors);
        try {
            const user = await User.deleteOne({_id: req.params.id});
            console.log(user);
            
            //As lessons podem ter comentários feitos pelo utilizador. Nesse caso temos que eliminar todos os comentários criados por este

            let message: IMessage = {
                http: 200,
                code: "UserDeleted",
                type: "success"
            };
            return res.status(message.http).json(message);
            
        } catch (error) {
            return res.status(400).json({http: 400,
                code: "BadRequest",
                type: "error"});
            
        }
    }
    public async active(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req).array();
        if (errors.length > 0) return res.status(406).send(errors);
        try {
            const user = await User.updateOne({_id: req.params.id},{$set: { is_active: false}});
            if (user.upsertedCount <=0){
                return res.status(404).json({
                    http: 404,
                    code: "UserNotFound",
                    type: "error"
                });
            }
            let message: IMessage = {
                http: 200,
                code: "Activated",
                type: "success"};
            return res.status(message.http).json(message);
            
        } catch (error) {
            return res.status(400).json({http: 400,
                code: "BadRequest",
                type: "error"});
            
        }
    }
    public async inactive(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req).array();
        if (errors.length > 0) return res.status(406).send(errors);
        try {
            const user = await User.updateOne({_id: req.params.id},{$set: { is_active: false}});
            if (user.upsertedCount <=0){
                return res.status(404).json({
                    http: 404,
                    code: "UserNotFound",
                    type: "error"
                });
            }
            let message: IMessage = {
                http: 200,
                code: "Activated",
                type: "success"};
            return res.status(message.http).json(message);
            
        } catch (error) {
            return res.status(400).json({http: 400,
                code: "BadRequest",
                type: "error"});
            
        }
    }
}

export default new UserController();