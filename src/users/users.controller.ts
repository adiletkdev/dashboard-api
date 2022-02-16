import { NextFunction, Request, Response } from 'express'
import { BaseController } from '../common/base.controller'
import { LoggerService } from '../logger/logger.service'

export class UserController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger)

    this.bindRoutes([
      { method: 'post', path: '/login', func: this.login },
      { method: 'post', path: '/register', func: this.register }
    ])
  }

  login(req: Request, res: Response, next: NextFunction) {
    this.ok(res, 'login')
  }

  register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, 'register')
  }
}