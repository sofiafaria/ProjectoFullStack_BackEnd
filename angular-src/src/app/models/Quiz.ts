
interface IQuiz{
    _id: string;
    name: string,
    points: number,
    level: number,
    lesson: string,
    date: Date,
    questions: Array<string>,
    is_active: boolean
};

export {IQuiz};