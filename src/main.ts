import { Container, ContainerModule, interfaces } from 'inversify'
import 'reflect-metadata'
import { App } from './app'
import { ExceptionFilter } from './errors/exception.filter'
import { IExceptionFilter } from './errors/exception.filter.interface'
import { ILogger } from './logger/logger.interface'
import { LoggerService } from './logger/logger.service'
import { TYPES } from './types'
import { UserController } from './users/users.controller'
import { IUserService } from './users/users.service.interface'
import { UserService } from './users/users.service'
import { IUserController } from './users/users.controller.interface'
import { ConfigService } from './config/config.service'
import { IConfigService } from './config/config.service.interface'

export interface IBootstrapReturn {
  appContainer: Container
  app: App
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope()
  bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter)
  bind<IUserController>(TYPES.UserController).to(UserController)
  bind<IUserService>(TYPES.UserService).to(UserService)
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope()
  bind<App>(TYPES.Application).to(App)
})

function bootstrap(): IBootstrapReturn {
  const appContainer = new Container()
  appContainer.load(appBindings)
  const app = appContainer.get<App>(TYPES.Application)
  app.init()

  return { app, appContainer }
}

export const { app, appContainer } = bootstrap()
