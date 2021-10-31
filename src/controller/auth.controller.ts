import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import  jwt  from 'jsonwebtoken';
import { IUser,User } from '../models/User';
import { IMessage } from '../models/Message';

 class AuthController {

    public async register( req:Request, res: Response): Promise <Response> {

        const errors = validationResult(req).array();
        if (errors.length > 0) return res.status(406).json(errors);
        try {
            const findUser = await User.findOne({'username': req.body.username});
            //Se o user já existe, retornamos erro
            if(findUser){
                let message: IMessage = {
                    http: 409,
                    code: 'UsernameAlreadyExists',
                    type: 'error'
                };
                return res.status(message.http).json(message); 
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);


            const newUser: Document<IUser> = new User({
                name: req.body.name,
                email: req.body.email,
                is_admin: req.body.is_admin,
                username: req.body.username,
                password: hash
            });
            await newUser.save();

         let message: IMessage ={
             http: 200,
             code: "UserRegistered",
             type: "success"
         };
         message.body = newUser;
            return res.status(message.http).json(message);
        }catch (error) {
            return res.status(400).json({http: 400,
                code: "BadRequest",
                type: "error"});
        }
    }

    public async authenticate (req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req).array();
        if(errors.length>0) return res.status(406).send(errors);
        let username = req.body.username;
        let password = escape(req.body.password);

        try {
            const user= await User.findOne({'username': username});

            if(!user || !bcrypt.compareSync(password, user.password)){
                return res.status(403).json({ http:403 ,code: "UsernamePasswordWrong",type: "error"});
            }
            //em caso de sucesso geramos o token e retornamos
            let token = jwt.sign({data: user}, 'yoursecret', {
                expiresIn: 604800 //1 week
            });

            let message: IMessage ={
                http: 200,
                code: "UserInfoRetrieved",
                type: "success"
            };
            message.body = {token: `Bearer ${token}`, user};
            return res.status(message.http).json(message);

        } catch (error) {
            return res.status(400).json(
                {http: 400,
                code: "BadRequest",
                type: "error"});   
        }
	}

    
//     public async profile(req: Request, res: Response): Promise<Response>{
//         let message ={
//             http: 200,
//             code: "UserInfoRetrieved",
//             type: "success"
//         };
//         message.body = req.user;
//         return res.status(message.http).json(message);

//     }


//     public async validate (req: Request, res: Response, callback): Promise<Response>{
//         return res.status(message.http).json(message);
//     }

 }

 export default new AuthController();