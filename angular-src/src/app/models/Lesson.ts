 interface ILesson{
    _id: string,
	name: string,
    group: string, 
	description: string,
	level: number,
	is_active: boolean,
	links?: string[]
};

export {ILesson};
