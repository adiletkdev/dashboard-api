import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { BaseController } from '../common/base.controller'
import { HTTPError } from '../errors/http-error.class'
import { ILogger } from '../logger/logger.interface'
import { TYPES } from '../types'
import 'reflect-metadata'
import { IUserController } from './users.controller.interface'
import { UserLoginDto } from './dto/users-login.dto'
import { UserRegisterDto } from './dto/users-register.dto'

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
    super(loggerService)

    this.bindRoutes([
      { method: 'post', path: '/login', func: this.login },
      { method: 'post', path: '/register', func: this.register },
    ])
  }

  login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
    console.log(req.body)
    // next(new HTTPError(401, 'Ошибка авторизации', 'login'))
    this.ok(res, 'login')
  }

  register(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): void {
    console.log(req.body)
    this.ok(res, 'register')
  }
}
