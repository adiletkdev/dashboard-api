import { UserModel } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { IConfigService } from '../config/config.service.interface'
import { TYPES } from '../types'
import { UserLoginDto } from './dto/users-login.dto'
import { UserRegisterDto } from './dto/users-register.dto'
import { User } from './user.entity'
import { UsersRepository } from './users.repository'
import { IUserService } from './users.service.interface'
@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.UsersRepository) private usersRepository: UsersRepository
  ) {}

  async createUser({ name, email, password }: UserRegisterDto): Promise<UserModel | null> {
    const newUser = new User(email, name)
    const salt = this.configService.get('SALT')
    await newUser.setPassword(password, Number(salt))
    const existedUser = await this.usersRepository.find(email)
    if (existedUser) {
      return null
    }
    return this.usersRepository.create(newUser)
  }

  async validateUser(dto: UserLoginDto): Promise<boolean> {
    const existedUser = await this.usersRepository.find(dto.email)
    if (!existedUser) {
      return false
    }
    const newUser = new User(existedUser.email, existedUser.name, existedUser.password)
    return newUser.comparePassword(dto.password)
  }
}
