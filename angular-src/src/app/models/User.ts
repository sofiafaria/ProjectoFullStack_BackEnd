 interface IUser{
    _id: string;
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
};

export {IUser};
