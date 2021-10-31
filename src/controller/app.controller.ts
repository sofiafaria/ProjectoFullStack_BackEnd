import { Request, Response } from "express";
import path from 'path';


class AppController{
    public async welcome (req: Request, res: Response): Promise<any> {
        return res.sendFile( path.join(__dirname,'public/index.html'));
    }
}

export default new AppController();