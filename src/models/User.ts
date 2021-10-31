import { Document, Model, model, Types, Schema, Query } from "mongoose";

//1. Create an interface representing a document in MongoDB
interface IUser{
    name?: string;
    email: string;
    is_admin: boolean;
    username: string,
    password: string,
    registration_date: Date;
    is_active: boolean;
    gamification?: {
        points: number,
        quiz: string[]
    };

}
//2. Create a Schema corresponding to the document interface
const userSchema: Schema = new Schema({
    name: String,
    email: {
        type:String,
        required: true
    },
    is_admin: Boolean,
    username: {
        type: String,
        unique: true
    },
    password: String,
    registration_date: {
        type: Date,
        default: Date.now
    },
    is_active: {
        type: Boolean,
        default: true
    },
    gamification: {
        points: {
            type: Number,
            default: 0
        },
        quiz: [{
            type: String
        }]
    }
});

//3. Create a Model
const User = model<IUser>('User', userSchema);

//  function getUserById(id: string, callback: any){
//     User.findById(id, callback);

// }

// function getUserByUsername (username: string, callback: any){
//     const query = {username: username};
//     User.findOne(query, callback);
// }
export {IUser, User};
