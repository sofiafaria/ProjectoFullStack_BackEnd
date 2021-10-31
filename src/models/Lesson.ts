import { UserWhitespacable } from "@babel/types";
import { IdentityCard } from "express-validator/src/options";
import { DateTime } from "luxon";
import { Document, Model, model, Types, Schema, Query, Mongoose } from "mongoose";



//1. Create an interface representing a document in MongoDB
interface ILesson{

	name: string,
    group: string, 
	description: string,
	links?: [String],
    evaluation: [{
        type: string
    }]

	level: number,
	comment?: {
        body: string,
        user: string
    },
	is_active: boolean
}

const LessonSchema = new Schema({
    name: String,
    group: String,
    description: String,
    links: [String],
    evaluation: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    level: Number,
    comment: {
        body: String,
        user: {
            type:Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
        },
    updated_at: Date,
    updated_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
        },
    is_active: Boolean
});

const Lesson = model('Lesson', LessonSchema);

export {ILesson, Lesson}
