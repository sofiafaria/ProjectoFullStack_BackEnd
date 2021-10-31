import { model, Schema } from "mongoose";
import { IQuestion } from "./Question";

interface IQuiz{
    name: string,
    points: number,
    level: number,
    date: Date,
    lesson: string
    questions: Array<string>,
    is_active: boolean
}

const quizSchema = new Schema({
    name: String,
    points: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    lesson: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson'
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],
    is_active: {
        type: Boolean,
        default: true
    }

});

const Quiz = model<IQuiz>('Quiz', quizSchema);

export {IQuiz, Quiz}

