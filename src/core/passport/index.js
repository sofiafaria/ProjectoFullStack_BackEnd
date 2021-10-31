import passport from "passport";
import { JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import userController from "~/controller/user.controller";
import { IUser, User } from "../../models/User";

export const passport = function(passport){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = 'yoursecret';
    passport.use(new JwtStrategy(opts, (jwt_payload, done) =>{
        userController.getOne()
        
    }))
    
}