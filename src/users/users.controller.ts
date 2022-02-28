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
import { sign } from 'jsonwebtoken'
import { IConfigService } from '../config/config.service.interface'
import { AuthGuard } from '../common/auth.guard'

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.ConfigService) private configService: IConfigService
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
      {
        method: 'get',
        path: '/info',
        func: this.info,
        middlewares: [new AuthGuard()],
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
    const secret = this.configService.get('SECRET')
    const jwt = await this.signJWT(req.body.email, secret)
    this.ok(res, { jwt })
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

  async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
    const userInfo = await this.userService.getUserInfo(user)
    this.ok(res, { email: userInfo?.email, id: userInfo?.id })
  }

  private signJWT(email: string, secret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign(
        {
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: 'HS256',
        },
        (err, token) => {
          if (err) {
            reject(err)
          } else if (typeof token === 'string') {
            resolve(token)
          }
          // resolve(token as string)
        }
      )
    })
  }
}
