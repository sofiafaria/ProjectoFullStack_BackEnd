import { model, Schema } from "mongoose";

interface IQuestion{
    question: string,
    title: string,
    description: string,
    type: string,
    group: string,
    level: number,
    answers: [{title: string, description: string, correct: boolean}],
    date: Date,
    is_active: boolean,
    link?: {types: String, url: string}
}

const questionSchema = new Schema({
    question: String,
    title: String,
    description: String,
    type: String,
    group: String,
    level: {
        type: Number,
        default: 0
    },
    answers: [{
        title: String,
        description: String,
        correct: Boolean
    }],
    date: {
        type: Date,
        default: Date.now
    },
    is_active: {
        type: Boolean,
        default: true
    },
    link: {
        types: String,
        url: String
    }

});

const Question = model<IQuestion>('Question', questionSchema);

export {IQuestion, Question}