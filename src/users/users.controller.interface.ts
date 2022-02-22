import { NextFunction, Request, Response } from 'express'

export interface IUserController {
  // 1
  login: (req: Request, res: Response, next: NextFunction) => void
  // 2 login(req: Request, res: Response, next: NextFunction): void
  register(req: Request, res: Response, next: NextFunction): void
}