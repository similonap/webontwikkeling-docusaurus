import { Request, Response, NextFunction } from "express";

export function flashMiddleware(req: Request, res: Response, next: NextFunction) {
    next();
}