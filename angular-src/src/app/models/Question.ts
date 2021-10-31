interface IQuestion{
    _id: string,
    question: string,
    title: string,
    description: string,
    type: string,
    group: string,
    level: number,
    answers: [{_id?: string, title: string, description: string, correct: boolean}],
    date: Date,
    is_active: boolean,
    link?: {types: String, url: string}
};

export {IQuestion}