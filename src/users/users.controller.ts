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
import { UserService } from './users.service'
import { ValidateMiddleware } from '../common/validate.middleware'

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: UserService
  ) {
    super(loggerService)

    this.bindRoutes([
      {
        method: 'post',
        path: '/login',
        func: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
      {
        method: 'post',
        path: '/register',
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
    ])
  }

  async login(
    req: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.userService.validateUser(req.body)
    if (!result) {
      return next(new HTTPError(401, 'Ошибка авторизации', 'login'))
    }
    this.ok(res, 'login')
  }

  async register(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.userService.createUser(body)
    if (!result) {
      return next(new HTTPError(422, 'Такой пользователь уже существует', 'register'))
    }
    this.ok(res, { email: result.email, id: result.id })
  }
}
