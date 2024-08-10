import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export default function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.SECRET_KEY ?? "", (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
