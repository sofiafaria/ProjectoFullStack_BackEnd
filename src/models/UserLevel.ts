import { Document, Model, model, Types, Schema, Query } from "mongoose";

interface IUserLevel{
    level: number,
    name: string,
    avatar: string,
    max: number
}

const userLevelSchema = new Schema({
    level: Number,
    name: String,
    avatar: String,
    max: Number
});

const UserLevel = model<IUserLevel>('UserLevel', userLevelSchema);

export {IUserLevel, userLevelSchema}