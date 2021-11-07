import { join } from 'path';
import express from 'express';
import exphbs from 'express-handlebars';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import cors from 'cors';
import { ConsoleColor} from './core/console';
import Logger from './core/logger';
import RequestLoggerMiddleware from './core/http/request-logger-middleware';
import router from './routes';
import db from './core/database';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { User } from './models/User';
import path from 'path';

export default class App {
  public static run (port: number): void {
    //On error
    db.on('error', err => console.log('Error ', err.message));
    //On Connection
    db.once('open', async() =>{
    console.log('Connected to database');
        // só inicia app se houver conexao à bd
        const app = new App().express;
        app.listen(port, () => Logger.log(`---> App started at port ${port}`, ConsoleColor.FgGreen));
    });


  }

  public express: express.Application;

  constructor() {
    this.express = express();
    this.setupViewEngine();
    this.setupExpress();
    this.setupLogger();
    this.routes();
  }

  private setupViewEngine(): void {
    this.express.engine('hbs', exphbs({
      defaultLayout: 'main',
      extname: '.hbs'
    }));
    this.express.set('view engine', 'hbs');
  }

  private setupExpress(): void {
    // CORS Middleware - qualquer domínio pode aceder a estes endpoints
    this.express.use(cors()); 
    this.express.use(express.json({
      limit: '25mb'}));
    this.express.use(express.urlencoded({
      extended: true,
      limit: '25mb'
    }));

    //images
    this.express.use(express.static(path.join('./public')));
    
    this.express.use(session({
      secret: "yoursecret",
      resave: true,
      saveUninitialized: true
    }));
    this.express.use(cookieParser())
    //Passport Middleware
    this.express.use(passport.initialize());
    this.express.use(passport.session());

    //Passport Jwt Strategy
    let jwtOpts: any = {};
    jwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); 
    jwtOpts.secretOrKey = 'yoursecret';

    passport.use( new Strategy(jwtOpts, (jwt_payload, done: any) =>{
      if(!jwt_payload){
        return null;
      }
      User.findOne({id: jwt_payload.data._id}, (err: any,user: any)=>{
        if(err) return done(err, false);
        if(user){
          return done(null, user);
        }else{
          return done(null, false);
        }
      });
    }));

    //interaçao com cookies no browser
    passport.serializeUser((user: any, cb) =>{
      cb(null, user.id);
    });

    passport.deserializeUser((id: string, cb) =>{
      User.findOne({ _id: id}, (err: any, user: any) =>{
        const userInformation = {
          username: user.username,
          is_admin: user.is_admin
        };
        cb(err, userInformation);
      });
    });

  }

  private setupLogger (): void {
    this.express.use(RequestLoggerMiddleware.logRequest);

  }

  private routes (): void {
    this.express.use(express.static(join(__dirname,'..','public')));
    this.express.use(router);
  }
}
