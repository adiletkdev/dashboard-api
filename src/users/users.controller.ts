import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { BaseController } from '../common/base.controller'
import { HTTPError } from '../errors/http-error.class'
import { ILogger } from '../logger/logger.interface'
import { TYPES } from '../types'
import 'reflect-metadata'
import { IUserController } from './users.controller.interface'

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
    super(loggerService)

    this.bindRoutes([
      { method: 'post', path: '/login', func: this.login },
      { method: 'post', path: '/register', func: this.register },
    ])
  }

  login(req: Request, res: Response, next: NextFunction): void {
    // next(new HTTPError(401, 'Ошибка авторизации', 'login'))
    this.ok(res, 'login')
  }

  register(req: Request, res: Response, next: NextFunction): void {
    this.ok(res, 'register')
  }
}
