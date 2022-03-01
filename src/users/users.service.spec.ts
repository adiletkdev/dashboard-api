import 'reflect-metadata'
import { Container } from 'inversify'
import { IConfigService } from '../config/config.service.interface'
import { TYPES } from '../types'
import { IUsersRepository } from './users.repository.interface'
import { IUserService } from './users.service.interface'
import { UserService } from './users.service'
import { User } from './user.entity'
import { UserModel } from '@prisma/client'

const ConfigServiceMock: IConfigService = {
  get: jest.fn(),
}

const UserRepositoryMock: IUsersRepository = {
  create: jest.fn(),
  find: jest.fn(),
}

const container = new Container()
let configService: IConfigService
let userRepository: IUsersRepository
let userService: IUserService

let createdUser: UserModel | null

beforeAll(() => {
  container.bind<IUserService>(TYPES.UserService).to(UserService)
  container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock)
  container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UserRepositoryMock)

  configService = container.get<IConfigService>(TYPES.ConfigService)
  userRepository = container.get<IUsersRepository>(TYPES.UsersRepository)
  userService = container.get<IUserService>(TYPES.UserService)
})

describe('User service', () => {
  it('createUser', async () => {
    configService.get = jest.fn().mockReturnValueOnce('11')
    userRepository.create = jest.fn().mockImplementationOnce(
      (user: User): UserModel => ({
        name: user.name,
        email: user.email,
        password: user.password,
        id: 1,
      })
    )

    // createUser
    createdUser = await userService.createUser({
      email: 'a@gmail.com',
      name: 'Adilet',
      password: '777',
    })

    expect(createdUser?.id).toEqual(1)
    expect(createdUser?.password).not.toEqual('777')
  })

  it('validateUser - succes', async () => {
    userRepository.find = jest.fn().mockReturnValueOnce(createdUser)

    // validateUser
    const res = await userService.validateUser({
      email: 'a@gmail.com',
      password: '777',
    })

    expect(res).toBeTruthy()
  })

  it('validateUser - wrong password', async () => {
    userRepository.find = jest.fn().mockReturnValueOnce(createdUser)

    // validateUser
    const res = await userService.validateUser({
      email: 'a@gmail.com',
      password: 'wrongpass',
    })

    expect(res).toBeFalsy()
  })

  it('validateUser - wrong user', async () => {
    userRepository.find = jest.fn().mockReturnValueOnce(null)

    // validateUser
    const res = await userService.validateUser({
      email: 'a@gmail.com',
      password: 'wrongpass',
    })

    expect(res).toBeFalsy()
  })
})
