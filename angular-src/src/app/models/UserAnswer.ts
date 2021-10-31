interface IUserAnswer{
    questionId: string,
    chosenOptionId: string,
    chosenOptionCorrect?: boolean,
    correctOptionId?: string
}

export {IUserAnswer};