import { inject, injectable } from 'inversify'
import { IConfigService } from '../config/config.service.interface'
import { TYPES } from '../types'
import { UserLoginDto } from './dto/users-login.dto'
import { UserRegisterDto } from './dto/users-register.dto'
import { User } from './user.entity'
import { IUserService } from './users.service.interface'
@injectable()
export class UserService implements IUserService {
  constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}

  async createUser({ name, email, password }: UserRegisterDto): Promise<User | null> {
    const newUser = new User(email, name)
    const salt = this.configService.get('SALT')
    await newUser.setPassword(password, Number(salt))
    return newUser
  }

  async validateUser(dto: UserLoginDto): Promise<boolean> {
    return true
  }
}
